import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { StoryBatch } from './entities/story-batch.entity';
import { Story } from './entities/story.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { WorkspaceSettings } from '../workspaces/entities/workspace-settings.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { AiModule } from '../ai/ai.module';
import { StorageModule } from '../storage/storage.module';
import { InstagramModule } from '../instagram/instagram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryBatch, Story, Workspace, WorkspaceSettings, Product]),
    ProductsModule,
    AiModule,
    StorageModule,
    InstagramModule,
  ],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}

