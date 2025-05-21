import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airlines/:airlineId/airports')
export class AirlineAirportController {
  constructor(private readonly service: AirlineAirportService) {}

  @Post(':airportId')
  @HttpCode(201)
  addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return this.service.addAirportToAirline(airlineId, airportId);
  }

  @Get()
  findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return this.service.findAirportsFromAirline(airlineId);
  }

  @Get(':airportId')
  findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return this.service.findAirportFromAirline(airlineId, airportId);
  }

  @Put()
  updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body() body: { airportIds: string[] },
  ) {
    return this.service.updateAirportsFromAirline(airlineId, body.airportIds);
  }

  @Delete(':airportId')
  @HttpCode(204)
  deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return this.service.deleteAirportFromAirline(airlineId, airportId);
  }
}
