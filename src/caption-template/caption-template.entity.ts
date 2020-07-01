import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.entity';

@Entity()
export class CaptionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'longtext',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  baseTemplate: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(
    type => User,
    user => user.captionTemplates,
    { cascade: true, onDelete: 'CASCADE' },
  )
  user: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}
