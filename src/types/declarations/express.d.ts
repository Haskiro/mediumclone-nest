import { UserEntity } from '@app/user/entities/user.entity';

declare module 'express' {
  interface Request {
    user: UserEntity | null;
  }
}
