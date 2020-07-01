export enum SubmissionJobNames {
  SUBMIT_MEDIA = 'SUBMIT_MEDIA'
}

export interface ISubmitMediaJobData {
  submissionId?: string
}

export enum SubmissionStatuses {
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED'
}