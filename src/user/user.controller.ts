import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { UserEntity } from '@app/user/entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<{
    user: UserEntity;
  }> {
    const createUserResult = await this.userService.createUser(createUserDto);

    return {
      user: createUserResult,
    };
  }
}
