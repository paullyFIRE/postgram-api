import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Media } from 'src/media/media.entity';
import { FeedFilterTypes } from './feed-filter.interface';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class FeedFilter {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({
    default: FeedFilterTypes.HASHTAG,
  })
  type: FeedFilterTypes;

  @Column()
  value: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(
  type => User,
  user => user.filters,
  { cascade: true, onDelete: 'CASCADE' },
  )
  user: User;

  @ApiHideProperty()
  @Exclude()
  @OneToMany(
    type => Media,
    media => media.filter,
  )
  media?: Media[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}
