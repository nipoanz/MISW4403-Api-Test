import { CreateAirlineDto } from './create-airline.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAirlineDto extends PartialType(CreateAirlineDto) {}
