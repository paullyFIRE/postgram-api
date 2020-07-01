import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Permissions } from './permissions.decorator';
import { AddPostgramUserToRequest } from 'src/interceptors/addPostgramUserToRequest.interceptor';
import { ApiUnauthorizedResponse, ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

export function Auth(role?) {
  if (!role) {
    return applyDecorators(
      UseGuards(AuthGuard('jwt'), PermissionsGuard),
      UseInterceptors(AddPostgramUserToRequest),
      ApiUnauthorizedResponse(),
      ApiBearerAuth('X-USER')
    );
  }

  return applyDecorators(
    UseGuards(AuthGuard('jwt'), PermissionsGuard),
    Permissions(role),
    UseInterceptors(AddPostgramUserToRequest),
    ApiForbiddenResponse(),
    ApiUnauthorizedResponse(),
    ApiBearerAuth('X-USER')
  );
}
