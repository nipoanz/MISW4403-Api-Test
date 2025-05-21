import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirportDto } from '../../dto/create-airport.dto';
import { UpdateAirportDto } from '../../dto/update-airport.dto';

@Injectable()
export class AirportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.airport.findMany();
  }

  async findOne(id: string) {
    const airport = await this.prisma.airport.findUniqueOrThrow({ where: { id } }).catch((error) => {
      throw new NotFoundException(`Airport with id ${id} not found`);
    });
    return airport;
  }

  async create(data: CreateAirportDto) {
    const existingAirport = await this.prisma.airport.findUnique({
      where: { code: data.code },
    });
    if (existingAirport) {
      throw new NotFoundException(`Airport with code ${data.code} already exists`);
    }
    return this.prisma.airport.create({ data });
  }

  async update(id: string, data: UpdateAirportDto) {
    await this.findOne(id);
    return this.prisma.airport.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.airport.delete({ where: { id } });
  }
}
