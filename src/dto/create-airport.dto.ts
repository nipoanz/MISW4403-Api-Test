import { IsString, Length } from 'class-validator';

export class CreateAirportDto {
  @IsString()
  name: string;

  @IsString()
  @Length(3, 3, { message: 'The airport code must be exactly 3 characters' })
  code: string;

  @IsString()
  country: string;

  @IsString()
  city: string;
}
