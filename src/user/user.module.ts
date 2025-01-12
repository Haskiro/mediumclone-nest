import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { UserExceptionsService } from '@app/user/services/user-exceptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserExceptionsService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
