import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AddPostgramUserToRequest implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    const authRef = req.user.sub

    req.user = await this.userService.findOneByAuth0Ref(authRef)

    return next.handle();
  }
}
