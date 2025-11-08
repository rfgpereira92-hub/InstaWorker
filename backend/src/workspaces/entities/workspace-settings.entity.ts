import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity({ name: 'workspace_settings' })
export class WorkspaceSettings {
  @PrimaryColumn('uuid')
  workspace_id!: string;

  @OneToOne(() => Workspace, (w) => w.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: Workspace;

  @Column({ type: 'int', default: 4 })
  stories_per_day!: number;

  @Column({ type: 'jsonb', default: () => `'{"10:00","14:00","18:00","21:00"}'` })
  time_slots!: string[];

  @Column({ type: 'boolean', default: false })
  auto_post_enabled!: boolean;

  @Column({ type: 'int', default: 3 })
  max_repetition_days!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}

