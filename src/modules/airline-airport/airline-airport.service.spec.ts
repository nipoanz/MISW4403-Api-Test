import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let prismaService: PrismaService;

  // Datos de muestra para las pruebas
  const mockAirlineId = 'airline-uuid';
  const mockAirportId = 'airport-uuid';
  const mockAirportId2 = 'airport-uuid-2';

  // Mock de objetos completos
  const mockAirline = {
    id: mockAirlineId,
    name: 'Test Airline',
    description: 'Test Description',
    foundingDate: new Date(),
    website: 'https://testairline.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAirport = {
    id: mockAirportId,
    name: 'Test Airport',
    code: 'TST',
    country: 'Test Country',
    city: 'Test City',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAirport2 = {
    id: mockAirportId2,
    name: 'Test Airport 2',
    code: 'TS2',
    country: 'Test Country 2',
    city: 'Test City 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAirlineAirport = {
    airlineId: mockAirlineId,
    airportId: mockAirportId,
    startDate: new Date(),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    airport: mockAirport,
    airline: mockAirline,
  };

  const mockPrismaService = {
    airline: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    airport: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    airlineAirport: {
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlineAirportService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Restablecer todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline', async () => {
      // Mock de las respuestas de Prisma
      mockPrismaService.airline.findUnique.mockResolvedValue(mockAirline);
      mockPrismaService.airport.findUnique.mockResolvedValue(mockAirport);
      mockPrismaService.airline.update.mockResolvedValue({
        ...mockAirline,
        airports: [{ airport: mockAirport }],
      });

      // Ejecutar el método
      const result = await service.addAirportToAirline(mockAirlineId, mockAirportId);

      // Verificar que se hayan realizado las llamadas correctas
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirlineId },
      });
      expect(mockPrismaService.airport.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirportId },
      });
      expect(mockPrismaService.airline.update).toHaveBeenCalledWith({
        where: { id: mockAirlineId },
        data: {
          airports: {
            create: [{ airport: { connect: { id: mockAirportId } } }],
          },
        },
        include: { airports: true },
      });

      // Verificar el resultado
      expect(result).toEqual({
        ...mockAirline,
        airports: [{ airport: mockAirport }],
      });
    });

    it('should throw NotFoundException if airline not found', async () => {
      // Mock de respuestas de Prisma
      mockPrismaService.airline.findUnique.mockResolvedValue(null);

      // Verificar que se lance la excepción
      await expect(
        service.addAirportToAirline(mockAirlineId, mockAirportId)
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirlineId },
      });
    });

    it('should throw NotFoundException if airport not found', async () => {
      // Mock de respuestas de Prisma
      mockPrismaService.airline.findUnique.mockResolvedValue(mockAirline);
      mockPrismaService.airport.findUnique.mockResolvedValue(null);

      // Verificar que se lance la excepción
      await expect(
        service.addAirportToAirline(mockAirlineId, mockAirportId)
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.airport.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirportId },
      });
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return all airports associated with an airline', async () => {
      // Mock de la respuesta de Prisma
      mockPrismaService.airline.findUnique.mockResolvedValue({
        ...mockAirline,
        airports: [
          { airport: mockAirport },
          { airport: mockAirport2 },
        ],
      });

      // Ejecutar el método
      const result = await service.findAirportsFromAirline(mockAirlineId);

      // Verificar que se haya realizado la llamada correcta
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirlineId },
        include: {
          airports: {
            include: { airport: true },
          },
        },
      });

      // Verificar el resultado
      expect(result).toEqual([mockAirport, mockAirport2]);
    });

    it('should throw NotFoundException if airline not found', async () => {
      // Mock de la respuesta de Prisma
      mockPrismaService.airline.findUnique.mockResolvedValue(null);

      // Verificar que se lance la excepción
      await expect(
        service.findAirportsFromAirline(mockAirlineId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return a specific airport from an airline', async () => {
      // Mock de la respuesta de Prisma
      mockPrismaService.airlineAirport.findFirst.mockResolvedValue(mockAirlineAirport);

      // Ejecutar el método
      const result = await service.findAirportFromAirline(mockAirlineId, mockAirportId);

      // Verificar que se haya realizado la llamada correcta
      expect(mockPrismaService.airlineAirport.findFirst).toHaveBeenCalledWith({
        where: {
          airlineId: mockAirlineId,
          airportId: mockAirportId,
        },
        include: { airport: true },
      });

      // Verificar el resultado
      expect(result).toEqual(mockAirport);
    });

    it('should throw NotFoundException if relationship not found', async () => {
      // Mock de la respuesta de Prisma
      mockPrismaService.airlineAirport.findFirst.mockResolvedValue(null);

      // Verificar que se lance la excepción
      await expect(
        service.findAirportFromAirline(mockAirlineId, mockAirportId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update all airports for an airline', async () => {
      const airportIds = [mockAirportId, mockAirportId2];
    
      // Simulamos que existen aerolínea y aeropuertos
      mockPrismaService.airline.findUniqueOrThrow.mockResolvedValue(mockAirline);
      mockPrismaService.airport.findUniqueOrThrow
        .mockResolvedValueOnce(mockAirport)
        .mockResolvedValueOnce(mockAirport2);
    
      // Simulamos el update de la aerolínea con los aeropuertos actualizados
      mockPrismaService.airline.update.mockResolvedValue({
        ...mockAirline,
        airports: [mockAirport, mockAirport2],
      });
    
      const result = await service.updateAirportsFromAirline(mockAirlineId, airportIds);
    
      expect(mockPrismaService.airline.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockAirlineId },
      });
    
      expect(mockPrismaService.airport.findUniqueOrThrow).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.airport.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockAirportId },
      });
      expect(mockPrismaService.airport.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockAirportId2 },
      });
    
      expect(result).toEqual({
        ...mockAirline,
        airports: [mockAirport, mockAirport2],
      });
    });
    

    it('should throw NotFoundException if airline not found', async () => {
      // Mock de la respuesta de Prisma para que lance una excepción
      mockPrismaService.airline.findUniqueOrThrow.mockRejectedValue(new Error());

      // Verificar que se lance la excepción
      await expect(
        service.updateAirportsFromAirline(mockAirlineId, [mockAirportId])
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if any airport not found', async () => {
      // Mock de las respuestas de Prisma
      mockPrismaService.airline.findUniqueOrThrow.mockResolvedValue(mockAirline);
      mockPrismaService.airline.update.mockResolvedValue(mockAirline);
      mockPrismaService.airport.findUniqueOrThrow.mockRejectedValue(new Error());

      // Verificar que se lance la excepción
      await expect(
        service.updateAirportsFromAirline(mockAirlineId, [mockAirportId])
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should delete an airport from an airline', async () => {
      // Mock de las respuestas de Prisma
      mockPrismaService.airlineAirport.findFirst.mockResolvedValue(mockAirlineAirport);
      mockPrismaService.airlineAirport.delete.mockResolvedValue(mockAirlineAirport);

      // Ejecutar el método
      const result = await service.deleteAirportFromAirline(mockAirlineId, mockAirportId);

      // Verificar que se hayan realizado las llamadas correctas
      expect(mockPrismaService.airlineAirport.findFirst).toHaveBeenCalledWith({
        where: {
          airlineId: mockAirlineId,
          airportId: mockAirportId,
        },
      });
      
      expect(mockPrismaService.airlineAirport.delete).toHaveBeenCalledWith({
        where: {
          airlineId_airportId: {
            airlineId: mockAirlineId,
            airportId: mockAirportId,
          },
        },
      });

      // Verificar el resultado
      expect(result).toEqual(mockAirlineAirport);
    });

    it('should throw NotFoundException if relationship not found', async () => {
      // Mock de la respuesta de Prisma
      mockPrismaService.airlineAirport.findFirst.mockResolvedValue(null);

      // Verificar que se lance la excepción
      await expect(
        service.deleteAirportFromAirline(mockAirlineId, mockAirportId)
      ).rejects.toThrow(NotFoundException);
    });
  });
});