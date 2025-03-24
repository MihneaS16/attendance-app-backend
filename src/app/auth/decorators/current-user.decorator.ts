import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/app/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: Omit<User, 'password'> }>();
    return request.user;
  },
);
