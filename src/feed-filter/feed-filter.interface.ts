export enum FeedFilterTypes {
  HASHTAG = 'hashtag',
  USER = 'user',
}

export enum FeedFilterJobNames {
  SCRAPE_MEDIA = 'SCRAPE_MEDIA'
}

export interface IScrapeMediaJobData {
  feedFilterId?: string
}