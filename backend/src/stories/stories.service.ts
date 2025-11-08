import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, MoreThanOrEqual, Repository } from 'typeorm';
import { StoryBatch } from './entities/story-batch.entity';
import { Story } from './entities/story.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { WorkspaceSettings } from '../workspaces/entities/workspace-settings.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { AiService } from '../ai/ai.service';
import { StorageService } from '../storage/storage.service';
import { InstagramService } from '../instagram/instagram.service';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(StoryBatch) private readonly batches: Repository<StoryBatch>,
    @InjectRepository(Story) private readonly stories: Repository<Story>,
    @InjectRepository(Workspace) private readonly workspaces: Repository<Workspace>,
    @InjectRepository(WorkspaceSettings)
    private readonly settingsRepo: Repository<WorkspaceSettings>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly productsSvc: ProductsService,
    private readonly ai: AiService,
    private readonly storage: StorageService,
    private readonly instagram: InstagramService,
  ) {}

  async listByWorkspaceAndDate(workspaceId: string, date: string) {
    const batch = await this.batches.findOne({ where: { workspace: { id: workspaceId }, date } });
    if (!batch) return [];
    return this.stories.find({ where: { batch: { id: batch.id } } });
  }

  async generate(workspaceId: string, date: string, force = false) {
    const settings = await this.settingsRepo.findOne({ where: { workspace_id: workspaceId } });
    if (!settings) return { status: 'skipped', reason: 'No settings' } as const;

    let batch = await this.batches.findOne({ where: { workspace: { id: workspaceId }, date } });
    if (batch && !force) return { status: 'exists', batchId: batch.id } as const;
    if (batch && force) {
      await this.stories.delete({ batch: { id: batch.id } as any });
      await this.batches.delete({ id: batch.id });
    }
    batch = await this.batches.save(
      this.batches.create({ workspace: { id: workspaceId } as any, date, status: 'pending' }),
    );

    const candidates = await this.selectCandidates(workspaceId, settings.max_repetition_days);
    const timeSlots = (settings.time_slots && settings.time_slots.length
      ? settings.time_slots
      : ['10:00', '14:00', '18:00', '21:00'])
      .slice(0, settings.stories_per_day);

    let errors = 0;
    let created = 0;
    const ws = await this.workspaces.findOne({ where: { id: workspaceId } });

    for (let i = 0; i < timeSlots.length; i++) {
      const time_slot = timeSlots[i];
      const product = candidates[i % candidates.length];
      if (!product) break;
      try {
        const bestImage = await this.productsSvc.findBestImage(product.id);
        const imageUrl = bestImage?.image_url || '';
        const copy = await this.ai.generateStoryForProduct({
          workspace: {
            tone_of_voice: (ws?.tone_of_voice as any) || 'casual',
            language: ws?.language || 'pt-PT',
            emoji_style: ws?.emoji_style ?? true,
            primary_color: ws?.primary_color,
            logo_url: ws?.logo_url,
          },
          product,
          imageUrl,
        });
        const imageBuffer = await this.ai.renderStoryImage({
          baseImageUrl: imageUrl,
          logoUrl: ws?.logo_url,
          primaryColor: ws?.primary_color,
          headline: copy.headline,
          bodyText: copy.body_text,
          ctaText: copy.cta_text,
        });
        const uploadedUrl = await this.storage.upload(imageBuffer, `story-${workspaceId}-${date}-${i}.png`);
        const status: Story['status'] = settings.auto_post_enabled ? 'scheduled' : 'draft';
        await this.stories.save(
          this.stories.create({
            batch: { id: batch.id } as any,
            workspace: { id: workspaceId } as any,
            product: { id: product.id } as any,
            image_input: bestImage ? ({ id: bestImage.id } as any) : null,
            generated_image_url: uploadedUrl,
            headline: copy.headline,
            body_text: copy.body_text,
            cta_text: copy.cta_text,
            time_slot,
            status,
          }),
        );
        created++;
      } catch (e) {
        errors++;
      }
    }

    await this.batches.update({ id: batch.id }, { status: errors > 0 ? 'partial' : 'generated' });
    return { status: errors > 0 ? 'partial' : 'generated', created, errors, batchId: batch.id };
  }

  async selectCandidates(workspaceId: string, maxRepetitionDays: number) {
    const since = new Date();
    since.setDate(since.getDate() - maxRepetitionDays);
    const recentStories = await this.stories.find({
      where: {
        workspace: { id: workspaceId },
        created_at: MoreThanOrEqual(since),
      } as any,
      relations: ['product'],
    });
    const excluded = new Set<string>();
    for (const s of recentStories) if (s.product?.id) excluded.add(s.product.id);

    const allActive = await this.products.find({
      where: { workspace: { id: workspaceId }, status: 'active' as any },
      order: { created_at: 'DESC', updated_at: 'ASC' },
    });
    return allActive.filter((p) => !excluded.has(p.id));
  }

  async updateStory(id: string, data: Partial<Story>) {
    const existing = await this.stories.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Story not found');
    await this.stories.update({ id }, { ...data, status: 'edited' as any });
    return this.stories.findOne({ where: { id } });
  }

  async publishStory(id: string) {
    const story = await this.stories.findOne({ where: { id } });
    if (!story) throw new NotFoundException('Story not found');
    await this.instagram.publishStory(story.generated_image_url, story.headline);
    await this.stories.update({ id }, { status: 'posted' as any });
    return { success: true };
  }

  async publishBatch(id: string) {
    const stories = await this.stories.find({ where: { batch: { id } } });
    for (const s of stories.filter((x) => ['approved', 'scheduled'].includes(x.status))) {
      await this.instagram.publishStory(s.generated_image_url, s.headline);
      await this.stories.update({ id: s.id }, { status: 'posted' as any });
    }
    await this.batches.update({ id }, { status: 'posted' });
    return { success: true };
  }
}

