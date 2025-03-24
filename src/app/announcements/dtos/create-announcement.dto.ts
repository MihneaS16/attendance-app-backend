import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDTO {
  @ApiProperty({
    description: 'The title of the announcement',
    example: 'Tomorrow lecture',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  title: string;

  @ApiProperty({
    description: 'The content of the announcement',
    example: 'There will be no lecture tomorrow',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  content: string;
}
