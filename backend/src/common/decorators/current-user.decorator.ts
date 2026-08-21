import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  userId: string;
  phone: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtUser }>();
    return request.user;
  },
);
