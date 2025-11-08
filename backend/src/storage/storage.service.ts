import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  async upload(buffer: Buffer, keyHint: string): Promise<string> {
    // Mock upload: return a deterministic URL
    const base = process.env.STORAGE_BASE_URL || 'https://storage.local/mock';
    return `${base}/${encodeURIComponent(keyHint)}`;
  }
}

