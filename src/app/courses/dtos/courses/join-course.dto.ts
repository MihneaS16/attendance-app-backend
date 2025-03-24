import { IsNotEmpty, IsString, Length } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinCourseDTO {
  @ApiProperty({ description: 'The join code used to join the course' })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  joinCode: string;
}
