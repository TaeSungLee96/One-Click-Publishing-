import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'name은 필수입니다' })
  name!: string;

  @IsEmail({}, { message: '올바른 이메일 형식이어야 합니다' })
  @IsNotEmpty({ message: 'email은 필수입니다' })
  email!: string;
}
