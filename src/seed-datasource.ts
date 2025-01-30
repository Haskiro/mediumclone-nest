import { dataSourceOptions } from '@app/datasource';
import { DataSource } from 'typeorm';

const seedDataSourceOptions = {
  ...dataSourceOptions,
  migrations: ['seeds/*{.ts,.js}'],
};

const seedDataSource = new DataSource(seedDataSourceOptions);
export default seedDataSource;
