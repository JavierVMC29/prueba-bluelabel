// src/users/entities/task.ts
import { Entity, Column, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { BaseModel } from './base.entity';

@Entity()
export class Task extends BaseModel {
  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
