import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
