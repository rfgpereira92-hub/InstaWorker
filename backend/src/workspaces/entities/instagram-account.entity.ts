import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity({ name: 'instagram_accounts' })
export class InstagramAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => Workspace, (w) => w.instagram_accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: Workspace;

  @Column({ type: 'varchar' })
  instagram_business_id!: string;

  @Column({ type: 'varchar' })
  page_name!: string;

  @Column({ type: 'text' })
  access_token_encrypted!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}

