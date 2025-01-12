import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { ENV_FILE_PATHS } from '@app/shared/constants/env-file-paths';

dotenvConfig({
  path: ENV_FILE_PATHS,
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};

const appDataSource = new DataSource(dataSourceOptions);
export default appDataSource;
