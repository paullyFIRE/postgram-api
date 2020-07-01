import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Submission } from './submission.entity';
import { SubmissionService } from './submission.service';
import { UserService } from 'src/user/user.service';
import { MediaService } from 'src/media/media.service';
import { SubmissionJobsService } from './submission.jobs';
import { Auth } from 'src/decorators/auth.decorator';
import { DUser } from 'src/decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(
    private submissionService: SubmissionService,
    private userService: UserService,
    private mediaService: MediaService,
    private submissionJobsService: SubmissionJobsService,
  ) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all user submissions.' })
  getAll(@DUser() user: User): Promise<Submission[]> {
    return this.submissionService.findAllByUserId(user.id);
  }

  @Put(':submissionId')
  @Auth()
  @ApiOperation({ summary: 'Edit a submission.' })
  async edit(
    @DUser() user: User,
    @Param('submissionId') submissionId: string,
    @Body() submission: UpdateSubmissionDto,
  ): Promise<Submission> {
    const existingSubmission = await this.submissionService.findById(
      submissionId,
    );

    if (!existingSubmission)
      throw new NotFoundException('Submission not found.');
    if (existingSubmission.user.id !== user.id) {
      throw new ForbiddenException('User does not own submission.');
    }
    if (existingSubmission.publishedAt) {
      throw new ConflictException('Submission has already been submitted.');
    }

    await this.submissionService.update(submissionId, submission);

    const scheduleDateHasChanged =
      existingSubmission.scheduledFor !== existingSubmission.scheduledFor;

    if (scheduleDateHasChanged) {
      // cancel and re-create job for submission.
      await this.submissionJobsService.deleteSubmitMediaJob(submissionId);
      this.submissionJobsService.createSubmitMediaJob(
        { submissionId },
        submission.scheduledFor,
      );
    }

    return this.submissionService.findById(submissionId);
  }

  @Delete(':submissionId')
  @Auth()
  @ApiOperation({ summary: 'Delete a submission.' })
  async delete(
    @DUser() user: User,
    @Param('submissionId') submissionId: string,
  ): Promise<void> {
    const submission = await this.submissionService.findById(submissionId);

    if (!submission) throw new HttpException('', HttpStatus.NOT_FOUND);
    if (submission.user.id !== user.id) {
      throw new NotFoundException('User does not own submission');
    }
    if (submission.publishedAt)
      throw new ConflictException('Submission has already been published');

    this.submissionService.delete(submissionId);
    this.submissionJobsService.deleteSubmitMediaJob(submissionId);
    return;
  }

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Create a submission.' })
  @ApiResponse({
    status: 428,
    description:
      'User has not set their Instagram credentials, required for submission.',
  })
  async create(
    @DUser() authUser: User,
    @Body() body: CreateSubmissionDto,
  ): Promise<Submission> {
    const { mediaId, ...submission } = body;

    const user = await this.userService.findOne(authUser.id);

    if (!user.instagramUsername || !user.instagramPassword) {
      throw new HttpException(
        'User has not set their Instagram credentials, required for submission.',
        428,
      );
    }

    const media = await this.mediaService.findOne(mediaId);

    if (!media) throw new NotFoundException('Media not found');
    if (media.filter.user.id !== user.id) {
      throw new ForbiddenException('Media does not belong to user');
    }

    submission.user = user;
    submission.media = media;

    const newSubmission = await this.submissionService.create(submission);

    this.submissionJobsService.createSubmitMediaJob(
      {
        submissionId: newSubmission.id,
      },
      newSubmission.scheduledFor,
    );

    return this.submissionService.findById(newSubmission.id);
  }
}
