import { AgendaService } from 'nestjs-agenda';
import * as Agenda from 'agenda';
import { Injectable } from '@nestjs/common';
import { SubmissionJobNames, ISubmitMediaJobData } from './submission.interface';
import { SubmissionService } from './submission.service';

@Injectable()
export class SubmissionJobsService {
  constructor(
    private submissionService: SubmissionService,
    private readonly agenda: AgendaService,
  ) {
    this.agenda.define(
      SubmissionJobNames.SUBMIT_MEDIA,
      { lockLifetime: 10000 },
      this.submitMedia.bind(this),
    );
  }

  public async deleteSubmitMediaJob(
    submissionId: string,
  ): Promise<void> {
    await this.agenda.cancel({
      name: SubmissionJobNames.SUBMIT_MEDIA,
      'data.submissionId': submissionId,
    });
  }

  public createSubmitMediaJob(jobData: ISubmitMediaJobData, scheduleDate: Date) {
    this.agenda.schedule(scheduleDate, SubmissionJobNames.SUBMIT_MEDIA, jobData);
  }

  private async submitMedia(
    job: Agenda.Job,
    done: any,
  ): Promise<void> {
    const { submissionId }: ISubmitMediaJobData = job.attrs.data;

    await this.submissionService.upload(submissionId)

    done();
  }
}
