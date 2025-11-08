import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'text' })
  image_url!: string;

  @Column({ type: 'boolean', default: false })
  is_cover!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}

