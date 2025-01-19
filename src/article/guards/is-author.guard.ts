import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';

@Injectable()
export class IsAuthorGuard implements CanActivate {
  constructor(private readonly articleService: ArticleService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    const article = await this.articleService.findBySlug(request.params.slug);

    if (request.user.id === article?.author.id) return true;

    throw new ForbiddenException("You're not the author");
  }
}
