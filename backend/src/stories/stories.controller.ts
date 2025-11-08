import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateStoryDto } from './dto/update-story.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class StoriesController {
  constructor(private readonly svc: StoriesService) {}

  @Get('workspaces/:id/stories')
  list(@Param('id') id: string, @Query('date') date: string) {
    return this.svc.listByWorkspaceAndDate(id, date);
  }

  @Post('workspaces/:id/stories/generate')
  generate(
    @Param('id') id: string,
    @Body() body: { date?: string; force?: boolean },
  ) {
    const date = body.date || new Date().toISOString().slice(0, 10);
    return this.svc.generate(id, date, body.force);
  }

  @Patch('stories/:id')
  patch(@Param('id') id: string, @Body() dto: UpdateStoryDto) {
    return this.svc.updateStory(id, dto);
  }

  @Post('stories/:id/publish')
  publishStory(@Param('id') id: string) {
    return this.svc.publishStory(id);
  }

  @Post('story_batches/:id/publish')
  publishBatch(@Param('id') id: string) {
    return this.svc.publishBatch(id);
  }
}

