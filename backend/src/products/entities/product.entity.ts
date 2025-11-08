import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { ProductImage } from './product-image.entity';
import { Story } from '../../stories/entities/story.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => Workspace, (w) => w.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: Workspace;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  brand!: string;

  @Column({ type: 'varchar' })
  model!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'int' })
  mileage_km!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price!: string;

  @Column({ type: 'varchar' })
  fuel_type!: string;

  @Column({ type: 'varchar' })
  gearbox!: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  highlights!: string[];

  @Index()
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: 'active' | 'sold' | 'hidden';

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToMany(() => ProductImage, (i) => i.product)
  images!: ProductImage[];

  @OneToMany(() => Story, (s) => s.product)
  stories!: Story[];
}

