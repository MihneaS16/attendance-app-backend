import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({ description: 'The new device id of the user' })
  @IsString()
  deviceId: string;
}
