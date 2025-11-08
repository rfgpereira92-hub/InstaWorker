import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get('workspaces/:id/products')
  list(@Param('id') id: string) {
    return this.svc.list(id);
  }

  @Post('workspaces/:id/products')
  create(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.svc.create(id, dto);
  }

  @Get('products/:id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Patch('products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.svc.update(id, dto);
  }

  @Delete('products/:id')
  softDelete(@Param('id') id: string) {
    return this.svc.softDelete(id);
  }

  @Post('products/:id/images')
  addImage(@Param('id') id: string, @Body() body: { image_url: string; is_cover?: boolean }) {
    return this.svc.addImage(id, body.image_url, body.is_cover);
  }

  @Delete('product_images/:id')
  deleteImage(@Param('id') id: string) {
    return this.svc.deleteImage(id);
  }
}

