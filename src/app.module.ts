import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ENV_FILE_PATHS } from '@app/shared/constants/env-file-paths';
import { dataSourceOptions } from '@app/datasource';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV_FILE_PATHS,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
