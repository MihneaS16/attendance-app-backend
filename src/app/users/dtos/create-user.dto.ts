import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from '@nestjs/class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDTO {
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
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The first name of the user', example: 'Mihnea' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Seitoaru',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ description: 'The role of the user', example: Role.STUDENT })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: 'The device id for the student' })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
