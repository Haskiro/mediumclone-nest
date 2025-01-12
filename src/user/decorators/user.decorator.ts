import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@app/user/entities/user.entity';

export const User = createParamDecorator(
  (data: keyof UserEntity, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (request.user && data) {
      return request.user[data];
    }

    return request.user;
  },
);
