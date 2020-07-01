import { Injectable, ConflictException } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { CaptionTemplate } from './caption-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCaptionTemplateDto } from './dtos/create-caption-template.dto';
import { UpdateCaptionTemplateDto } from './dtos/update-caption-template.dto';

@Injectable()
export class CaptionTemplateService {
  constructor(
    @InjectRepository(CaptionTemplate)
    private captionTemplateRepo: Repository<CaptionTemplate>,
  ) {}

  findById(submissionId: string): Promise<CaptionTemplate> {
    return this.captionTemplateRepo.findOne(submissionId, {
      relations: ['user'],
    });
  }

  findAllByUserId(userId: string): Promise<CaptionTemplate[]> {
    return this.captionTemplateRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  delete(id: string): Promise<DeleteResult> {
    return this.captionTemplateRepo.delete(id);
  }

  async update(
    id: string,
    captionTemplate: UpdateCaptionTemplateDto,
  ): Promise<UpdateResult> {
    return this.captionTemplateRepo.update(id, captionTemplate);
  }

  async create(
    captionTemplate: CreateCaptionTemplateDto,
  ): Promise<CaptionTemplate> {
    const existingTemplate = await this.captionTemplateRepo.findOne({
      where: {
        name: captionTemplate.name,
        baseTemplate: captionTemplate.baseTemplate,
        user: {
          id: captionTemplate.user.id,
        },
      },
    });

    if (existingTemplate) throw new ConflictException('Filter already exists.');

    return this.captionTemplateRepo.save(captionTemplate);
  }
}
