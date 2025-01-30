export interface IReactArticleParams {
  currentUserId: number;
  slug: string;
  action: 'like' | 'dislike';
}
