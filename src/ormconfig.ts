import { ConnectionOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const getOrmConfig = (
  configService: ConfigService,
): ConnectionOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT')),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
});
