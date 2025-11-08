import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'story_batches' })
@Unique(['workspace', 'date'])
export class StoryBatch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => Workspace, (w) => w.story_batches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: Workspace;

  @Index()
  @Column({ type: 'date' })
  date!: string; // YYYY-MM-DD

  @Column({ type: 'varchar', length: 20, default: 'generated' })
  status!: 'pending' | 'generated' | 'posted' | 'partial';

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}

