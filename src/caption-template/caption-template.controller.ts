import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DUser } from 'src/decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { Auth } from 'src/decorators/auth.decorator';
import { CaptionTemplate } from './caption-template.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaptionTemplateService } from './caption-template.service';
import { CreateCaptionTemplateDto } from './dtos/create-caption-template.dto';
import { UpdateCaptionTemplateDto } from './dtos/update-caption-template.dto';

@ApiTags('Caption Templates')
@Controller('caption-templates')
export class CaptionTemplateController {
  constructor(private captionTemplateService: CaptionTemplateService) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get users caption-templates.' })
  getTemplates(@DUser() user: User): Promise<CaptionTemplate[]> {
    return this.captionTemplateService.findAllByUserId(user.id);
  }

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Create a caption-template for a user.' })
  async createTemplate(
    @DUser() user: User,
    @Body() captionTemplate: CreateCaptionTemplateDto,
  ): Promise<CaptionTemplate> {
    captionTemplate.user = user;

    const createdCaptionTemplate = await this.captionTemplateService.create(
      captionTemplate,
    );

    delete createdCaptionTemplate.user;

    return createdCaptionTemplate;
  }

  @Put(':templateId')
  @Auth()
  @ApiOperation({ summary: 'Update a caption-template for a user.' })
  async updateTemplate(
    @DUser() user: User,
    @Param('templateId') templateId: string,
    @Body() captionTemplate: UpdateCaptionTemplateDto,
  ): Promise<CaptionTemplate> {
    const existingTemplate = await this.captionTemplateService.findById(
      templateId,
    );

    if (!existingTemplate) throw new NotFoundException('Template not found.');
    if (existingTemplate.user.id !== user.id) {
      throw new ForbiddenException('User does not own template.');
    }

    await this.captionTemplateService.update(templateId, captionTemplate);

    return this.captionTemplateService.findById(templateId);
  }

  @Delete(':templateId')
  @Auth()
  @ApiOperation({ summary: 'Delete a caption-template for a user.' })
  async deleteTemplate(
    @DUser() user: User,
    @Param('templateId') templateId: string,
  ): Promise<CaptionTemplate> {
    const existingTemplate = await this.captionTemplateService.findById(
      templateId,
    );

    if (!existingTemplate) throw new NotFoundException('Template not found.');
    if (existingTemplate.user.id !== user.id) {
      throw new ForbiddenException('User does not own template.');
    }

    this.captionTemplateService.delete(templateId);

    return;
  }
}
