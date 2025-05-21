import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AirlineModule } from './modules/airline/airline.module';
import { AirportModule } from './modules/airport/airport.module';
import { AirlineAirportModule } from './modules/airline-airport/airline-airport.module';

@Module({
  imports: [PrismaModule, AirlineModule, AirportModule, AirlineAirportModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
