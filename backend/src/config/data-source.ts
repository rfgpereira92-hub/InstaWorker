import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../auth/entities/user.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { WorkspaceSettings } from '../workspaces/entities/workspace-settings.entity';
import { InstagramAccount } from '../workspaces/entities/instagram-account.entity';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { StoryBatch } from '../stories/entities/story-batch.entity';
import { Story } from '../stories/entities/story.entity';

const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [
    User,
    Workspace,
    WorkspaceSettings,
    InstagramAccount,
    Product,
    ProductImage,
    StoryBatch,
    Story,
  ],
  migrations: [__dirname + '/../../migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});

export default AppDataSource;

