import { Injectable } from '@nestjs/common';

@Injectable()
export class InstagramService {
  async publishStory(imageUrl: string, caption?: string) {
    // Mock integration with Meta Graph API
    return { success: true, imageUrl, caption };
  }
}

