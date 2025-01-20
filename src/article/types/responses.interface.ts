import { ArticleEntity } from '@app/article/entities/article.entity';

export interface IArticleResponse {
  article: ArticleEntity;
}

export interface IArticlesListResponse {
  articles: ArticleEntity[];
  articlesCount: number;
}
