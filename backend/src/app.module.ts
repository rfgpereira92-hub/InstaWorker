import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/data-source';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ProductsModule } from './products/products.module';
import { StoriesModule } from './stories/stories.module';
import { AiModule } from './ai/ai.module';
import { StorageModule } from './storage/storage.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({ ...AppDataSource.options }),
    }),
    AuthModule,
    WorkspacesModule,
    ProductsModule,
    StoriesModule,
    AiModule,
    StorageModule,
    UploadModule,
  ],
})
export class AppModule {}
