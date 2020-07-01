import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Submission } from '../submission/submission.entity';
import { FeedFilter } from 'src/feed-filter/feed-filter.entity';

export enum MediaTypes {
  VIDEO = 'video',
}

export enum MediaVisibilityStatuses {
  UNSEEN = 'unseen',
  SEEN = 'seen',
}

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({
    default: MediaTypes.VIDEO,
  })
  type?: MediaTypes;

  @Column({
    default: MediaVisibilityStatuses.UNSEEN,
  })
  visibilityStatus?: MediaVisibilityStatuses;

  @Column({ name: 'video_hash' })
  videoHash: string;

  @Column({ name: 'post_url' })
  postUrl: string;

  @Column({ name: 'author_username' })
  authorUsername: string;

  @Column({ name: 'original_caption', type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  originalCaption: string;

  @Column()
  duration: number;

  @Column({ name: 'view_count' })
  viewCount: number;

  @Column({ name: 'comment_count' })
  commentCount: number;

  @Column({ name: 'likes_count' })
  likesCount: number;

  @Column({ default: false })
  favourite?: boolean;

  @OneToOne(
    type => Submission,
    submission => submission.media,
    { nullable: true, onDelete: 'SET NULL' },
  )
  submission?: Submission;

  @ManyToOne(
    type => FeedFilter,
    feedFilter => feedFilter.media,
    { onDelete: 'CASCADE', cascade: true },
  )
  filter: FeedFilter;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}
