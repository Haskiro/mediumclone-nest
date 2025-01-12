import { UnprocessableEntityException } from '@nestjs/common';

export class ExistUserException extends UnprocessableEntityException {
  constructor(message?: string) {
    super(message || 'Email or username are taken');
  }
}
