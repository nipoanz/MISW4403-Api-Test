import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAirlineDto } from '../../dto/update-airline.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirlineDto } from '../../dto/create-airline.dto';

@Injectable()
export class AirlineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAirlineDto) {
    const foundingDate = new Date(dto.foundingDate);
    const now = new Date();

    if (foundingDate >= now) {
      throw new BadRequestException(
        'La fecha de fundación debe estar en el pasado.',
      );
    }

    return this.prisma.airline.create({
      data: {
        ...dto,
        foundingDate,
      },
    });
  }

  findAll() {
    return this.prisma.airline.findMany();
  }

  async findOne(id: string) {
    const airline = await this.prisma.airline.findUnique({ where: { id } });
    if (!airline) throw new NotFoundException('Aerolínea no encontrada.');
    return airline;
  }

  async update(id: string, dto: UpdateAirlineDto) {
    if (dto.foundingDate) {
      const foundingDate = new Date(dto.foundingDate);
      if (foundingDate >= new Date()) {
        throw new BadRequestException(
          'La fecha de fundación debe estar en el pasado.',
        );
      }
    }

    return this.prisma.airline.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.airline.delete({ where: { id } });
  }
}
