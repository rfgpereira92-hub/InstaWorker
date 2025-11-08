import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class WorkspacesController {
  constructor(private readonly svc: WorkspacesService) {}

  @Get('workspaces')
  list(@CurrentUser() user: any) {
    return this.svc.listByUser(user.id);
  }

  @Post('workspaces')
  create(@CurrentUser() user: any, @Body() body: { name: string; logo_url?: string | null }) {
    return this.svc.create(user.id, body.name, body.logo_url);
  }

  @Get('workspaces/:id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Patch('workspaces/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Get('workspaces/:id/settings')
  getSettings(@Param('id') id: string) {
    return this.svc.getSettings(id);
  }

  @Patch('workspaces/:id/settings')
  updateSettings(@Param('id') id: string, @Body() dto: UpdateSettingsDto) {
    return this.svc.updateSettings(id, dto);
  }

  @Post('workspaces/:id/instagram/connect')
  connectInstagram(
    @Param('id') id: string,
    @Body() body: { instagram_business_id: string; page_name: string; access_token_encrypted: string },
  ) {
    return this.svc.connectInstagram(id, body);
  }

  @Get('workspaces/:id/instagram')
  listInstagram(@Param('id') id: string) {
    return this.svc.listInstagram(id);
  }

  @Delete('instagram_accounts/:id')
  deleteInstagram(@Param('id') id: string) {
    return this.svc.deleteInstagram(id);
  }
}

