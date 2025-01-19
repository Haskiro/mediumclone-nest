import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';
import { IArticleResponse } from '@app/article/types/article-response.interface';
import { DeleteResult } from 'typeorm';
import { IsAuthorGuard } from '@app/article/guards/is-author.guard';
import { UpdateArticleDto } from '@app/article/dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body('article') createArticleDto: CreateArticleDto,
    @User() currentUser: UserEntity,
  ): Promise<IArticleResponse> {
    const newArticle = await this.articleService.create(
      createArticleDto,
      currentUser,
    );

    return this.articleService.buildArticleResponse(newArticle);
  }

  @Get('/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.findBySlug(slug);

    return this.articleService.buildArticleResponse(article);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard, IsAuthorGuard)
  async delete(@Param('slug') slug: string): Promise<DeleteResult> {
    return await this.articleService.delete(slug);
  }

  @Put('/:slug')
  @UseGuards(AuthGuard, IsAuthorGuard)
  async update(
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const updatedArticle = await this.articleService.update(
      slug,
      updateArticleDto,
    );

    return this.articleService.buildArticleResponse(updatedArticle);
  }
}
