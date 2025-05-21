import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirlineDto } from '../../dto/create-airline.dto';
import { UpdateAirlineDto } from '../../dto/update-airline.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AirlineService', () => {
  let service: AirlineService;
  let prismaService: PrismaService;

  // Mock data
  const mockAirline = {
    id: 'airline-uuid-1',
    name: 'Test Airline',
    description: 'Test Description',
    foundingDate: new Date('1990-01-01'),
    website: 'https://test-airline.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateAirlineDto: CreateAirlineDto = {
    name: 'Avianca',
    description: 'Aerolínea colombiana',
    website: 'https://avianca.com',
    foundingDate: '1990-01-01T00:00:00Z',
  };

  const mockUpdateAirlineDto: UpdateAirlineDto = {
    name: 'Updated Airline',
    description: 'Updated Description',
  };

  // Create complete mock for PrismaService
  const mockPrismaService = {
    airline: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlineService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    prismaService = module.get<PrismaService>(PrismaService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una aerolínea correctamente si la fecha es válida', async () => {
      // Arrange
      mockPrismaService.airline.create.mockResolvedValue({
        id: 'uuid',
        ...mockCreateAirlineDto,
        foundingDate: new Date(mockCreateAirlineDto.foundingDate),
      });

      // Act
      const result = await service.create(mockCreateAirlineDto);

      // Assert
      expect(result).toEqual({
        id: 'uuid',
        ...mockCreateAirlineDto,
        foundingDate: new Date(mockCreateAirlineDto.foundingDate),
      });
      expect(mockPrismaService.airline.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateAirlineDto,
          foundingDate: new Date(mockCreateAirlineDto.foundingDate),
        },
      });
    });

    it('debería lanzar BadRequestException si la fecha es futura', async () => {
      // Arrange
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const futureDateDto = {
        ...mockCreateAirlineDto,
        foundingDate: tomorrow.toISOString(),
      };

      // Act & Assert
      await expect(service.create(futureDateDto)).rejects.toThrow(
        new BadRequestException('La fecha de fundación debe estar en el pasado.')
      );
      expect(mockPrismaService.airline.create).not.toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si la fecha es hoy', async () => {
      // Arrange
      const today = new Date();
      const todayDateDto = {
        ...mockCreateAirlineDto,
        foundingDate: today.toISOString(),
      };

      // Act & Assert
      await expect(service.create(todayDateDto)).rejects.toThrow(
        new BadRequestException('La fecha de fundación debe estar en el pasado.')
      );
      expect(mockPrismaService.airline.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de aerolíneas', async () => {
      // Arrange
      const mockAirlines = [mockAirline, { ...mockAirline, id: 'airline-uuid-2' }];
      mockPrismaService.airline.findMany.mockResolvedValue(mockAirlines);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockAirlines);
      expect(mockPrismaService.airline.findMany).toHaveBeenCalled();
    });

    it('debería retornar un array vacío si no hay aerolíneas', async () => {
      // Arrange
      mockPrismaService.airline.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockPrismaService.airline.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar una aerolínea si existe', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValue(mockAirline);

      // Act
      const result = await service.findOne(mockAirline.id);

      // Assert
      expect(result).toEqual(mockAirline);
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
      });
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        new NotFoundException('Aerolínea no encontrada.')
      );
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });
  });

  describe('update', () => {
    it('debería actualizar una aerolínea correctamente', async () => {
      // Arrange
      const updatedAirline = { ...mockAirline, ...mockUpdateAirlineDto };
      mockPrismaService.airline.update.mockResolvedValue(updatedAirline);

      // Act
      const result = await service.update(mockAirline.id, mockUpdateAirlineDto);

      // Assert
      expect(result).toEqual(updatedAirline);
      expect(mockPrismaService.airline.update).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
        data: mockUpdateAirlineDto,
      });
    });

    it('debería actualizar una aerolínea con una fecha pasada válida', async () => {
      // Arrange
      const pastDate = new Date('1980-01-01').toISOString();
      const updateDtoWithDate = { ...mockUpdateAirlineDto, foundingDate: pastDate };
      const updatedAirline = {
        ...mockAirline,
        ...mockUpdateAirlineDto,
        foundingDate: new Date(pastDate),
      };
      mockPrismaService.airline.update.mockResolvedValue(updatedAirline);

      // Act
      const result = await service.update(mockAirline.id, updateDtoWithDate);

      // Assert
      expect(result).toEqual(updatedAirline);
      expect(mockPrismaService.airline.update).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
        data: updateDtoWithDate,
      });
    });

    it('debería lanzar BadRequestException si la fecha de actualización es futura', async () => {
      // Arrange
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const updateDtoWithFutureDate = {
        ...mockUpdateAirlineDto,
        foundingDate: tomorrow.toISOString(),
      };

      // Act & Assert
      await expect(service.update(mockAirline.id, updateDtoWithFutureDate)).rejects.toThrow(
        new BadRequestException('La fecha de fundación debe estar en el pasado.')
      );
      expect(mockPrismaService.airline.update).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si la actualización falla en la base de datos', async () => {
      // Arrange
      const dbError = new Error('Database error');
      mockPrismaService.airline.update.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.update(mockAirline.id, mockUpdateAirlineDto)).rejects.toThrow(dbError);
      expect(mockPrismaService.airline.update).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
        data: mockUpdateAirlineDto,
      });
    });
  });

  describe('delete', () => {
    it('debería eliminar una aerolínea correctamente', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValue(mockAirline);
      mockPrismaService.airline.delete.mockResolvedValue(mockAirline);

      // Act
      const result = await service.delete(mockAirline.id);

      // Assert
      expect(result).toEqual(mockAirline);
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
      });
      expect(mockPrismaService.airline.delete).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
      });
    });

    it('debería lanzar NotFoundException si la aerolínea a eliminar no existe', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.delete('non-existent-id')).rejects.toThrow(
        new NotFoundException('Aerolínea no encontrada.')
      );
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
      expect(mockPrismaService.airline.delete).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si la eliminación falla en la base de datos', async () => {
      // Arrange
      const dbError = new Error('Database error');
      mockPrismaService.airline.findUnique.mockResolvedValue(mockAirline);
      mockPrismaService.airline.delete.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.delete(mockAirline.id)).rejects.toThrow(dbError);
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
      });
      expect(mockPrismaService.airline.delete).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
      });
    });
  });
});