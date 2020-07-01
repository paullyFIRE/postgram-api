import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeedFilter } from '../feed-filter/feed-filter.entity';
import { Submission } from 'src/submission/submission.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { CaptionTemplate } from 'src/caption-template/caption-template.entity';

@Entity()
export class User extends BaseEntity {
  @ApiHideProperty()
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  email: string;

  @Column({ name: 'instagram_username', nullable: true })
  instagramUsername?: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'instagram_password', nullable: true })
  instagramPassword?: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'auth0_user_ref', nullable: false })
  auth0UserRef: string;

  @ApiHideProperty()
  @OneToMany(
    type => FeedFilter,
    filter => filter.user,
    { nullable: true },
  )
  filters?: FeedFilter[];

  @ApiHideProperty()
  @OneToMany(
    type => CaptionTemplate,
    captionTemplate => captionTemplate.user,
    { nullable: true },
  )
  captionTemplates?: CaptionTemplate[];

  @ApiHideProperty()
  @OneToMany(
    type => Submission,
    submission => submission.user,
  )
  submissions?: Submission[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}
