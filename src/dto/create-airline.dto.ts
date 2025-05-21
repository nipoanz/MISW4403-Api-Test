import { IsString, IsUrl, IsDateString } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  foundingDate: string;

  @IsUrl()
  website: string;
}
