import { UnauthorizedException } from '@nestjs/common';

export class IncorrectCredentialsException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'Email or password are incorrect');
  }
}
