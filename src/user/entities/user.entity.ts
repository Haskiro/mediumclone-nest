import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from '@app/article/entities/article.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: '',
  })
  bio: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    select: false,
  })
  password: string;

  @OneToMany(() => ArticleEntity, (article) => article.author, {
    onDelete: 'SET NULL',
  })
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity, (article) => article.favorited, {
    cascade: true,
  })
  @JoinTable()
  favorites: ArticleEntity[];
}
