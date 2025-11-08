import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly images: Repository<ProductImage>,
  ) {}

  list(workspaceId: string) {
    return this.products.find({ where: { workspace: { id: workspaceId } } });
  }

  async create(workspaceId: string, data: Partial<Product>) {
    const product = this.products.create({ ...data, workspace: { id: workspaceId } as any });
    return this.products.save(product);
  }

  get(id: string) {
    return this.products.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Product>) {
    await this.products.update({ id }, data);
    return this.get(id);
  }

  async softDelete(id: string) {
    await this.products.update({ id }, { status: 'hidden' as any });
    return { success: true };
  }

  addImage(productId: string, image_url: string, is_cover = false) {
    const img = this.images.create({ product: { id: productId } as any, image_url, is_cover });
    return this.images.save(img);
  }

  async deleteImage(id: string) {
    await this.images.delete({ id });
    return { success: true };
  }

  async findBestImage(productId: string) {
    const imgs = await this.images.find({ where: { product: { id: productId } } });
    const cover = imgs.find((i) => i.is_cover);
    return cover || imgs[0] || null;
  }
}

