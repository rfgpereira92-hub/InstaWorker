import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoryBatch } from './story-batch.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductImage } from '../../products/entities/product-image.entity';

@Entity({ name: 'stories' })
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => StoryBatch, (b) => b.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch!: StoryBatch;

  @Index()
  @ManyToOne(() => Workspace, (w) => w.stories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: Workspace;

  @Index()
  @ManyToOne(() => Product, (p) => p.stories, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product!: Product | null;

  @ManyToOne(() => ProductImage, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_input_id' })
  image_input!: ProductImage | null;

  @Column({ type: 'text' })
  generated_image_url!: string;

  @Column({ type: 'varchar', length: 120 })
  headline!: string;

  @Column({ type: 'varchar', length: 400 })
  body_text!: string;

  @Column({ type: 'varchar', length: 200 })
  cta_text!: string;

  @Column({ type: 'varchar', length: 10 })
  time_slot!: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: 'draft' | 'approved' | 'edited' | 'scheduled' | 'posted';

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}

