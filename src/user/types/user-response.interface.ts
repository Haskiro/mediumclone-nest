import { UserEntity } from '@app/user/entities/user.entity';

export interface IUserResponse {
  user: Omit<UserEntity, 'password'> & {
    token: string;
  };
}
