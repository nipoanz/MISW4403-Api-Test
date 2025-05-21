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
import { AirportService } from './airport.service';
import { UpdateAirportDto } from '../../dto/update-airport.dto';
import { CreateAirportDto } from '../../dto/create-airport.dto';

@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  findAll() {
    return this.airportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateAirportDto) {
    return this.airportService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAirportDto) {
    return this.airportService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.airportService.delete(id);
  }
}
