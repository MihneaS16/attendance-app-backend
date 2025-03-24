import { ApiProperty } from '@nestjs/swagger';
import { ProfessorDTO } from 'src/app/users/dtos/professor.dto';

export class AnnouncementDTO {
  @ApiProperty({ description: 'The id of the announcement' })
  id: string;

  @ApiProperty({ description: 'The title of the announcement' })
  title: string;

  @ApiProperty({ description: 'The content of the announcement' })
  content: string;

  @ApiProperty({ description: 'The date when the announcement was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'The professor who posted the announcement',
    type: ProfessorDTO,
  })
  postedBy: ProfessorDTO;
}
