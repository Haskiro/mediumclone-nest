import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsOptional()
  readonly body: string;
}
