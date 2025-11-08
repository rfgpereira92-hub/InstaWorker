import { Injectable } from '@nestjs/common';

export interface GenerateStoryParams {
  workspace: {
    tone_of_voice: 'casual' | 'formal';
    language: string;
    emoji_style: boolean;
    primary_color?: string | null;
    logo_url?: string | null;
  };
  product: any;
  imageUrl: string;
}

@Injectable()
export class AiService {
  async generateStoryForProduct({ workspace, product, imageUrl }: GenerateStoryParams) {
    const emoji = workspace.emoji_style ? '🚗✨' : '';
    const headline = `${emoji} ${product.brand} ${product.model} ${product.year}`.trim();
    const body_text = `${product.mileage_km} km • ${product.fuel_type} • ${product.gearbox} • ${product.price}€`;
    const cta_text = workspace.language.startsWith('pt') ? 'Envia-nos mensagem!' : 'Send us a DM!';
    return { headline, body_text, cta_text };
  }

  async renderStoryImage(params: {
    baseImageUrl: string;
    logoUrl?: string | null;
    primaryColor?: string | null;
    headline: string;
    bodyText: string;
    ctaText: string;
  }): Promise<Buffer> {
    // Mock renderer: return a tiny PNG buffer placeholder
    const buf = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c636000000200015c0b2f0000000049454e44ae426082', 'hex');
    return buf;
  }
}

