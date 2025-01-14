import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ENV_FILE_PATHS } from '@app/shared/constants/env-file-paths';
import { dataSourceOptions } from '@app/datasource';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { ArticleModule } from '@app/article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV_FILE_PATHS,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TagModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
