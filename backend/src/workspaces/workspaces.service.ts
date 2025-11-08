import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceSettings } from './entities/workspace-settings.entity';
import { InstagramAccount } from './entities/instagram-account.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private readonly workspaces: Repository<Workspace>,
    @InjectRepository(WorkspaceSettings)
    private readonly settingsRepo: Repository<WorkspaceSettings>,
    @InjectRepository(InstagramAccount)
    private readonly igRepo: Repository<InstagramAccount>,
  ) {}

  listByUser(userId: string) {
    return this.workspaces.find({ where: { owner: { id: userId } } });
  }

  async create(userId: string, name: string, logo_url?: string | null) {
    const ws = this.workspaces.create({ name, logo_url, owner: { id: userId } as any });
    await this.workspaces.save(ws);
    const settings = this.settingsRepo.create({ workspace_id: ws.id, time_slots: [
      '10:00','14:00','18:00','21:00'
    ], stories_per_day: 4, auto_post_enabled: false, max_repetition_days: 3 });
    await this.settingsRepo.save(settings);
    return ws;
  }

  async get(id: string) {
    const ws = await this.workspaces.findOne({ where: { id } });
    if (!ws) throw new NotFoundException('Workspace not found');
    return ws;
  }

  async update(id: string, data: Partial<Workspace>) {
    await this.workspaces.update({ id }, data);
    return this.get(id);
  }

  async getSettings(id: string) {
    const settings = await this.settingsRepo.findOne({ where: { workspace_id: id } });
    if (!settings) throw new NotFoundException('Settings not found');
    return settings;
  }

  async updateSettings(id: string, data: Partial<WorkspaceSettings>) {
    const existing = await this.getSettings(id);
    await this.settingsRepo.update({ workspace_id: id }, data);
    return { ...existing, ...data };
  }

  async connectInstagram(workspaceId: string, payload: {
    instagram_business_id: string; page_name: string; access_token_encrypted: string;
  }) {
    const account = this.igRepo.create({ ...payload, workspace: { id: workspaceId } as any });
    return this.igRepo.save(account);
  }

  listInstagram(workspaceId: string) {
    return this.igRepo.find({ where: { workspace: { id: workspaceId } } });
  }

  async deleteInstagram(id: string) {
    await this.igRepo.delete({ id });
    return { success: true };
  }
}

