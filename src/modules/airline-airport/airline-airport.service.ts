import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirlineAirportService {
    
  constructor(private readonly prisma: PrismaService) {}

  async addAirportToAirline(airlineId: string, airportId: string) {
    const airline = await this.prisma.airline.findUnique({ where: { id: airlineId } });
    if (!airline) throw new NotFoundException('Airline not found');

    const airport = await this.prisma.airport.findUnique({ where: { id: airportId } });
    if (!airport) throw new NotFoundException('Airport not found');

    return this.prisma.airline.update({
      where: { id: airlineId },
      data: {
        airports: {
          create: [{ airport: { connect: { id: airportId } } }],
        },
      },
      include: { airports: true },
    });
  }

  async findAirportsFromAirline(airlineId: string) {
    const airline = await this.prisma.airline.findUnique({
      where: { id: airlineId },
      include: {
        airports: {
          include: { airport: true },
        },
      },
    });
    if (!airline) throw new NotFoundException('Airline not found');
    return airline.airports.map((rel) => rel.airport);
  }

  async findAirportFromAirline(airlineId: string, airportId: string) {
    const relation = await this.prisma.airlineAirport.findFirst({
      where: {
        airlineId,
        airportId,
      },
      include: { airport: true },
    });
    if (!relation) throw new NotFoundException('Airport not associated with airline');
    return relation.airport;
  }

  async updateAirportsFromAirline(airlineId: string, airportIds: string[]) {
    await this.prisma.airline.findUniqueOrThrow({ where: { id: airlineId } }).catch(() => {
      throw new NotFoundException('Airline not found');
    });
    
   

    await this.prisma.airline.update({
      where: { id: airlineId },
      data: { airports: { deleteMany: {} } },
    });

    for (const id of airportIds) {
      await this.prisma.airport.findUniqueOrThrow({ where: { id } }).catch(() => {
        throw new NotFoundException('Airport not found');
      });
    }

    const createRelations = airportIds.map((airportId) => ({
      airport: { connect: { id: airportId } },
    }));

    return this.prisma.airline.update({
      where: { id: airlineId },
      data: {
        airports: {
          create: createRelations,
        },
      },
      include: {
        airports: { include: { airport: true } },
      },
    });
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    const relation = await this.prisma.airlineAirport.findFirst({
      where: {
        airlineId,
        airportId,
      },
    });

    if (!relation) throw new NotFoundException('Airport not associated with airline');

    return this.prisma.airlineAirport.delete({
      where: {
        airlineId_airportId: {
          airlineId,
          airportId,
        },
      },
    });
  }
}
