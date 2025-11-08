import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceSettings } from './entities/workspace-settings.entity';
import { InstagramAccount } from './entities/instagram-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, WorkspaceSettings, InstagramAccount])],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [TypeOrmModule, WorkspacesService],
})
export class WorkspacesModule {}

