import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { WorkspaceSettings } from './workspace-settings.entity';
import { InstagramAccount } from './instagram-account.entity';
import { Product } from '../../products/entities/product.entity';
import { StoryBatch } from '../../stories/entities/story-batch.entity';
import { Story } from '../../stories/entities/story.entity';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => User, (u) => u.workspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  logo_url!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  primary_color!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'casual' })
  tone_of_voice!: 'casual' | 'formal';

  @Column({ type: 'boolean', default: true })
  emoji_style!: boolean;

  @Column({ type: 'varchar', length: 10, default: 'pt-PT' })
  language!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @OneToOne(() => WorkspaceSettings, (s) => s.workspace)
  settings!: WorkspaceSettings;

  @OneToMany(() => InstagramAccount, (a) => a.workspace)
  instagram_accounts!: InstagramAccount[];

  @OneToMany(() => Product, (p) => p.workspace)
  products!: Product[];

  @OneToMany(() => StoryBatch, (b) => b.workspace)
  story_batches!: StoryBatch[];

  @OneToMany(() => Story, (s) => s.workspace)
  stories!: Story[];
}

