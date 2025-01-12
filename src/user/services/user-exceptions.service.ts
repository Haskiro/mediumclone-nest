import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserExceptionsService {
  throwExistUserException() {
    throw new HttpException(
      'Email or username are taken',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  throwIncorrectCredentialsException() {
    throw new HttpException(
      `Email or password are incorrect`,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
