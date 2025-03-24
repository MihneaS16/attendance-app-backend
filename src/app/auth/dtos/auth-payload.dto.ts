import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'mihnea@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'string' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
