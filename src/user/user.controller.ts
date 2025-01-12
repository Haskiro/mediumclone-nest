import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from '@app/user/services/user.service';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { IUserResponse } from '@app/user/types/user-response.interface';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import { Request } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  async getCurrentUser(@Req() request: Request): Promise<IUserResponse> {
    return this.userService.buildUserResponse(request.user);
  }
}
