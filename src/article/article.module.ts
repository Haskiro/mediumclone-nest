import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { IsAuthorGuard } from '@app/article/guards/is-author.guard';
import { UserEntity } from '@app/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleService, IsAuthorGuard],
})
export class ArticleModule {}
