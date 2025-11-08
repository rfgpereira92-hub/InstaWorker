import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password_hash!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @OneToMany(() => Workspace, (w) => w.owner)
  workspaces!: Workspace[];
}

