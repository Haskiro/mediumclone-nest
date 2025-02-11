import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import slugify from 'slugify';
import {
  IArticleResponse,
  IArticlesListResponse,
} from '@app/article/types/responses.interface';
import { UpdateArticleDto } from '@app/article/dto/update-article.dto';
import { IGetArticlesQueryParams } from '@app/article/types/get-articles-query-params.interface';
import { IReactArticleParams } from '@app/article/types/react-article-params.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    query: IGetArticlesQueryParams,
  ): Promise<IArticlesListResponse> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .leftJoin('articles.favorited', 'favorited')
      .orderBy('articles.createdAt', 'DESC');

    if (query.author) {
      queryBuilder.andWhere('LOWER(author.username) LIKE LOWER(:name)', {
        name: `%${query.author}%`,
      });
    }

    if (query.tag) {
      queryBuilder.andWhere('LOWER(articles.tagList) LIKE LOWER(:tag)', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.favorited) {
      queryBuilder.andWhere('LOWER(favorited.username) LIKE LOWER(:name)', {
        name: `%${query.favorited}%`,
      });
    }

    queryBuilder.limit(query.limit || 20).offset(query.offset || 0);

    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    return {
      articles,
      articlesCount,
    };
  }
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

  async delete(slug: string): Promise<DeleteResult> {
    return await this.articleRepository.delete({ slug });
  }

  async update(
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const isTitleChanged =
      updateArticleDto.title && updateArticleDto.title !== article.title;

    const updatedArticleSlug = isTitleChanged
      ? this.generateSlug(updateArticleDto.title)
      : article.slug;

    return this.articleRepository.save({
      ...article,
      ...updateArticleDto,
      slug: updatedArticleSlug,
    });
  }

  async reactArticle({
    currentUserId,
    slug,
    action,
  }: IReactArticleParams): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    const articleIdx = user.favorites.findIndex(
      (favoriteArticles) => favoriteArticles.id === article.id,
    );

    if (action === 'like' && articleIdx === -1) {
      user.favorites.push(article);
      article.favoritesCount += 1;

      await this.userRepository.save(user); // данные по article тоже обновятся, благодаря опции cascade: true
    } else if (action === 'dislike' && articleIdx !== -1) {
      user.favorites.splice(articleIdx, 1);
      article.favoritesCount -= 1;

      await this.userRepository.save(user);
      await this.articleRepository.save(article); // здесь cascade уже не поможет
    }

    return article;
  }

  async buildArticleResponse(
    article: ArticleEntity,
    currentUserId: number | null,
  ): Promise<IArticleResponse> {
    const articleWithFavorited = await this.articleRepository.findOne({
      where: {
        id: article.id,
      },
      relations: {
        favorited: true,
      },
    });

    const favorited =
      !!currentUserId &&
      !!articleWithFavorited.favorited.find(
        (user) => user.id === currentUserId,
      );

    return {
      article: {
        ...article,
        favorited,
      },
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
