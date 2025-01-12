import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user/services/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
    } else {
      const token = req.headers.authorization.split(' ')[1];
      const decodedData = verify(
        token,
        this.configService.get<string>('JWT_SECRET'),
      ) as JwtPayload;

      req.user = await this.userService.findById(decodedData.id);
      try {
      } catch {
        req.user = null;
      }
    }

    next();
  }
}
