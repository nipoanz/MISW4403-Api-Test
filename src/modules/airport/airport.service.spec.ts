import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AirportService', () => {
  let service: AirportService;
  let prisma: PrismaService;

  const mockPrisma = {
    airport: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirportService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AirportService>(AirportService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should find all airports', async () => {
    const airports = [{ id: '1', name: 'Airport1' }];
    mockPrisma.airport.findMany.mockResolvedValue(airports);

    const result = await service.findAll();
    expect(result).toEqual(airports);
    expect(mockPrisma.airport.findMany).toHaveBeenCalled();
  });

  it('should find one airport by id', async () => {
    const airport = { id: '1', name: 'Airport1' };
    mockPrisma.airport.findUnique.mockResolvedValue(airport);

    const result = await service.findOne('1');
    expect(result).toEqual(airport);
    expect(mockPrisma.airport.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should throw NotFoundException when airport not found', async () => {
    mockPrisma.airport.findUnique.mockResolvedValue(null);

    await expect(service.findOne('not-exist')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create an airport', async () => {
    const dto = {
      name: 'New Airport',
      code: 'ABC',
      country: 'Country',
      city: 'City',
    };
    mockPrisma.airport.create.mockResolvedValue(dto);

    const result = await service.create(dto);
    expect(result).toEqual(dto);
    expect(mockPrisma.airport.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should update an airport', async () => {
    const id = '1';
    const updateDto = { city: 'New City' };
    const existingAirport = {
      id,
      name: 'Airport1',
      code: 'ABC',
      country: 'Country',
      city: 'City',
    };
    const updatedAirport = { ...existingAirport, ...updateDto };

    mockPrisma.airport.findUnique.mockResolvedValue(existingAirport);
    mockPrisma.airport.update.mockResolvedValue(updatedAirport);

    const result = await service.update(id, updateDto);
    expect(result).toEqual(updatedAirport);
    expect(mockPrisma.airport.update).toHaveBeenCalledWith({
      where: { id },
      data: updateDto,
    });
  });

  it('should throw NotFoundException when updating a non-existent airport', async () => {
    mockPrisma.airport.findUnique.mockResolvedValue(null);

    await expect(
      service.update('not-exist', { city: 'New City' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete an airport', async () => {
    const id = '1';
    const airport = { id, name: 'Airport1' };
    mockPrisma.airport.findUnique.mockResolvedValue(airport);
    mockPrisma.airport.delete.mockResolvedValue(airport);

    const result = await service.delete(id);
    expect(result).toEqual(airport);
    expect(mockPrisma.airport.delete).toHaveBeenCalledWith({ where: { id } });
  });

  it('should throw NotFoundException when deleting a non-existent airport', async () => {
    mockPrisma.airport.findUnique.mockResolvedValue(null);

    await expect(service.delete('not-exist')).rejects.toThrow(
      NotFoundException,
    );
  });
});
