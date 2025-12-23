// src/users/entities/user.ts
import { Entity, Column, OneToMany } from 'typeorm';

import { BaseModel } from './base.entity';
import { Task } from './task.entity';

@Entity()
export class User extends BaseModel {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  // Requerimiento clave: Columna JSON
  @Column({ type: 'json', nullable: true })
  settings: {
    theme: string;
    notifications: boolean;
    language: string;
  };

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
