import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@app/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
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
}
