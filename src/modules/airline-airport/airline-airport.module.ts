import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineAirportController } from './airline-airport.controller';

@Module({
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController]
})
export class AirlineAirportModule {}
