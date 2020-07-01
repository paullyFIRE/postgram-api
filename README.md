# Postgram-api

A [NestJS](https://nestjs.com/) project (node/typescript) featured to:
 - Scrape instragram video-posts at regular intervals for specific hashtags
 - Re-upload user-selected media to their instagram account, with custom captions, scheduled upload time, and watermarked attribution on the re-uploaded media.
 - Provide the user with caption-templates that can be re-used when creating a submission.

API Docs: [http://178.62.90.98:7000/docs/#/](http://178.62.90.98:7000/docs/#/)

### Stack

 - Mysql
 - MongoDB (persisted schedules for scraping + submissions)
 - [Auth0](https://auth0.com/)
 - [NestJS](https://nestjs.com/) (NodeJs / Typescript)
 - [Puppeteer](https://github.com/puppeteer/puppeteer) (scraping)
 - [ffmpeg](https://ffmpeg.org/) (video editing and post-thumbnail creation)


## What should be done better

 1. **The scheduled jobs to scape media and upload submissions should be moved into their own process in a separate thread.**

Likely either hosted as a standalone queue-worker, or spawned off the main process as a [child process](https://nodejs.org/api/worker_threads.html).

With older versions of Puppeteer, zombie processes would be left behind after each job, ultimately resulting in service degradation due to low-memory. There is also a case to be made that at scale, the performance/scheduling of these jobs should not have an effect on the consumer-facing APIs.

 2. **Instagram's API should ideally be used instead to create a fully-featured service.**

 - Providing realtime stats (likes/comments) for media to the front-end is limited by what information was stored at the time of scraping.
 - On demand scraping of more media in realtime for the user to view, is likely not scalable.
 - Service requires credentials to the users Instagram account to upload on their behalf. This would never be acceptable in a commercial environment. OAuth authentication through Instagram would mitigate this concern.

Instagram has an official graph-API fixes all of this, however has a strict, and stringent application process with red-tape, including applying as a company.

## Misc. Learnings

NestJS provides a solid, opinionated structure to structuring NodeJs/Typescript applications. Makes it quite easy to organise code and manage complexity between controllers and services without mixing concerns.
