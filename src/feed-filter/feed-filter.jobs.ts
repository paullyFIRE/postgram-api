import { AgendaService } from 'nestjs-agenda';
import {
  FeedFilterJobNames,
  IScrapeMediaJobData,
} from './feed-filter.interface';
import * as Agenda from 'agenda';
import { FeedFilterService } from 'src/feed-filter/feed-filter.service';
import { MediaService } from 'src/media/media.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedFilterJobsService {
  constructor(
    private readonly agenda: AgendaService,
    private mediaService: MediaService,
    private feedFilterService: FeedFilterService,
  ) {
    this.agenda.define(
      FeedFilterJobNames.SCRAPE_MEDIA,
      { lockLifetime: 10000 },
      this.scrapeMediaForFilter.bind(this),
    );
  }

  public async deleteScapeMediaForFilterJob(
    feedFilterId: string,
  ): Promise<void> {
    await this.agenda.cancel({
      name: FeedFilterJobNames.SCRAPE_MEDIA,
      'data.feedFilterId': feedFilterId,
    });
  }

  public createScrapeMediaForFilterJob(jobData: IScrapeMediaJobData) {
    this.agenda.every('4 hours', FeedFilterJobNames.SCRAPE_MEDIA, jobData);
  }

  private async scrapeMediaForFilter(
    job: Agenda.Job,
    done: any,
  ): Promise<void> {
    const data: IScrapeMediaJobData = job.attrs.data;

    const filter = await this.feedFilterService.findById(data.feedFilterId);

    this.mediaService.scrapeMediaForFilter(filter);

    done();
  }
}
