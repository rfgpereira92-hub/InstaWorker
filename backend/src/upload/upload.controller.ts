import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StorageService } from '../storage/storage.service';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly storage: StorageService) {}

  @Post()
  async upload(@Body() body: { filename: string; dataBase64?: string }) {
    const buffer = body.dataBase64 ? Buffer.from(body.dataBase64, 'base64') : Buffer.alloc(0);
    const image_url = await this.storage.upload(buffer, body.filename || 'file');
    return { image_url };
  }
}

