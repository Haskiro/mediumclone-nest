import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@app/user/entities/user.entity';
import { sign } from 'jsonwebtoken';
import { IUserResponse } from '@app/user/types/user-response.interface';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import {
  ExistUserException,
  IncorrectCredentialsException,
} from '@app/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existUser) throw new ExistUserException();

    const hashedPassword = await hash(
      createUserDto.password,
      parseInt(this.configService.get<string>('SALT_ROUNDS')),
    );

    const newUser = new UserEntity();
    Object.assign(newUser, {
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'email', 'username', 'password', 'image', 'bio'],
    });

    if (foundUser) {
      const isPasswordCorrect = await compare(
        loginUserDto.password,
        foundUser.password,
      );

      if (isPasswordCorrect) return foundUser;
    }

    throw new IncorrectCredentialsException();
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      this.configService.get<string>('JWT_SECRET'),
    );
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    delete user.password;

    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
