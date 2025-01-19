import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import slugify from 'slugify';
import { IArticleResponse } from '@app/article/types/article-response.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}
  async create(
    createArticleDto: CreateArticleDto,
    author: UserEntity,
  ): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();

    Object.assign(newArticle, {
      ...createArticleDto,
      slug: this.generateSlug(createArticleDto.title),
      author,
      tagList: createArticleDto.tagList || [],
    });

    return this.articleRepository.save(newArticle);
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOneBy({
      slug,
    });

    if (!article)
      throw new NotFoundException(`Article with slug ${slug} not found`);

    return article;
  }

  async delete(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new ForbiddenException(
        "You can't delete this article. You're not the author",
      );
    }

    return await this.articleRepository.delete({ slug });
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return {
      article,
    };
  }

  private generateSlug(title: string): string {
    return (
      slugify(title, {
        lower: true,
      }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
