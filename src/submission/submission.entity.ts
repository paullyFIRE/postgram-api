import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Media } from 'src/media/media.entity';
import { User } from 'src/user/user.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { SubmissionStatuses } from './submission.interface';

@Entity()
export class Submission {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
    caption?: string

    @Column({ name: 'attribution_username' })
    attributionUsername?: string

    @Column({ default: SubmissionStatuses.SCHEDULED })
    status?: SubmissionStatuses

    @Column({ nullable: true })
    meta?: string

    @Column({ name: 'scheduled_for', type: 'datetime', default: () => "CURRENT_TIMESTAMP", nullable: true })
    scheduledFor?: Date

    @Column({ name: 'published_at', type: 'datetime', nullable: true })
    publishedAt?: Date

    @OneToOne(type => Media, media => media.submission)
    @JoinColumn()
    media?: Media

    @ApiHideProperty()
    @Exclude()
    @ManyToOne(type => User, user => user.submissions)
    user?: User

    @CreateDateColumn({
      name: 'created_at',
    })
    createdAt?: Date;

    @UpdateDateColumn({
      name: 'updated_at',
    })
    updatedAt?: Date;
}
