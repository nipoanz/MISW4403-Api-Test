import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { CreateAirlineDto } from '../../dto/create-airline.dto';
import { UpdateAirlineDto } from '../../dto/update-airline.dto';

@Controller('airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateAirlineDto) {
    return this.airlineService.create(dto);
  }

  @Get()
  findAll() {
    return this.airlineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airlineService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAirlineDto) {
    return this.airlineService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.airlineService.delete(id);
  }
}
