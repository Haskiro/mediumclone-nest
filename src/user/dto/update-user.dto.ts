import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  readonly email: string;

  @IsNotEmpty()
  @IsOptional()
  readonly username: string;

  @IsNotEmpty()
  @IsOptional()
  readonly password: string;

  @IsOptional()
  readonly image: string;

  @IsOptional()
  readonly bio: string;
}
