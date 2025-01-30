import { ArticleEntity } from '@app/article/entities/article.entity';

export interface IArticleResponse {
  article: Omit<ArticleEntity, 'favorited'> & { favorited: boolean };
}

export interface IArticlesListResponse {
  articles: ArticleEntity[];
  articlesCount: number;
}
