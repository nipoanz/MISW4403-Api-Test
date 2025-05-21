import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let prismaService: PrismaService;

  // Mock data
  const mockAirline = {
    id: 'airline-uuid-1',
    name: 'Test Airline',
    description: 'Test Description',
    foundingDate: new Date(),
    website: 'https://test-airline.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAirport = {
    id: 'airport-uuid-1',
    name: 'Test Airport',
    code: 'TST',
    country: 'Test Country',
    city: 'Test City',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAirport2 = {
    id: 'airport-uuid-2',
    name: 'Another Airport',
    code: 'ANT',
    country: 'Another Country',
    city: 'Another City',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAirlineAirport = {
    airlineId: 'airline-uuid-1',
    airportId: 'airport-uuid-1',
    startDate: new Date(),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    airline: mockAirline,
    airport: mockAirport,
  };

  // Create mock for PrismaService
  const mockPrismaService = {
    airline: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    airport: {
      findUnique: jest.fn(),
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
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    prismaService = module.get<PrismaService>(PrismaService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline successfully', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValueOnce(mockAirline);
      mockPrismaService.airport.findUnique.mockResolvedValueOnce(mockAirport);
      mockPrismaService.airline.update.mockResolvedValueOnce({
        ...mockAirline,
        airports: [{ airport: mockAirport }],
      });

      // Act
      const result = await service.addAirportToAirline(mockAirline.id, mockAirport.id);

      // Assert
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
      });
      expect(mockPrismaService.airport.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirport.id },
      });
      expect(mockPrismaService.airline.update).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
        data: {
          airports: {
            create: [{ airport: { connect: { id: mockAirport.id } } }],
          },
        },
        include: { airports: true },
      });
      expect(result).toEqual({
        ...mockAirline,
        airports: [{ airport: mockAirport }],
      });
    });

    it('should throw NotFoundException when airline does not exist', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.addAirportToAirline('non-existent', mockAirport.id))
        .rejects.toThrow(new NotFoundException('Airline not found'));
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.airport.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.airline.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when airport does not exist', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValueOnce(mockAirline);
      mockPrismaService.airport.findUnique.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.addAirportToAirline(mockAirline.id, 'non-existent'))
        .rejects.toThrow(new NotFoundException('Airport not found'));
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.airport.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.airline.update).not.toHaveBeenCalled();
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return all airports associated with an airline', async () => {
      // Arrange
      const mockAirlineWithAirports = {
        ...mockAirline,
        airports: [
          { airport: mockAirport },
          { airport: mockAirport2 },
        ],
      };
      mockPrismaService.airline.findUnique.mockResolvedValueOnce(mockAirlineWithAirports);

      // Act
      const result = await service.findAirportsFromAirline(mockAirline.id);

      // Assert
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
        include: {
          airports: {
            include: { airport: true },
          },
        },
      });
      expect(result).toEqual([mockAirport, mockAirport2]);
    });

    it('should throw NotFoundException when airline does not exist', async () => {
      // Arrange
      mockPrismaService.airline.findUnique.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findAirportsFromAirline('non-existent'))
        .rejects.toThrow(new NotFoundException('Airline not found'));
      expect(mockPrismaService.airline.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return specific airport associated with an airline', async () => {
      // Arrange
      mockPrismaService.airlineAirport.findFirst.mockResolvedValueOnce(mockAirlineAirport);

      // Act
      const result = await service.findAirportFromAirline(mockAirline.id, mockAirport.id);

      // Assert
      expect(mockPrismaService.airlineAirport.findFirst).toHaveBeenCalledWith({
        where: {
          airlineId: mockAirline.id,
          airportId: mockAirport.id,
        },
        include: { airport: true },
      });
      expect(result).toEqual(mockAirport);
    });

    it('should throw NotFoundException when relation does not exist', async () => {
      // Arrange
      mockPrismaService.airlineAirport.findFirst.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findAirportFromAirline(mockAirline.id, 'non-existent'))
        .rejects.toThrow(new NotFoundException('Airport not associated with airline'));
      expect(mockPrismaService.airlineAirport.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update all airports associated with an airline', async () => {
      // Arrange
      const airportIds = [mockAirport.id, mockAirport2.id];
      mockPrismaService.airline.findUniqueOrThrow.mockResolvedValueOnce(mockAirline);
      mockPrismaService.airline.update.mockImplementation((params) => {
        if (params.data.airports.deleteMany) {
          return Promise.resolve({ ...mockAirline, airports: [] });
        } else {
          return Promise.resolve({
            ...mockAirline,
            airports: [
              { airport: mockAirport },
              { airport: mockAirport2 },
            ],
          });
        }
      });

      // Act
      const result = await service.updateAirportsFromAirline(mockAirline.id, airportIds);

      // Assert
      expect(mockPrismaService.airline.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockAirline.id },
      });
      expect(mockPrismaService.airline.update).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.airline.update).toHaveBeenNthCalledWith(1, {
        where: { id: mockAirline.id },
        data: { airports: { deleteMany: {} } },
      });
      expect(mockPrismaService.airline.update).toHaveBeenNthCalledWith(2, {
        where: { id: mockAirline.id },
        data: {
          airports: {
            create: [
              { airport: { connect: { id: mockAirport.id } } },
              { airport: { connect: { id: mockAirport2.id } } },
            ],
          },
        },
        include: {
          airports: { include: { airport: true } },
        },
      });
      expect(result).toEqual({
        ...mockAirline,
        airports: [
          { airport: mockAirport },
          { airport: mockAirport2 },
        ],
      });
    });

    it('should throw an error when airline does not exist', async () => {
      // Arrange
      mockPrismaService.airline.findUniqueOrThrow.mockRejectedValueOnce(new Error('Airline not found'));

      // Act & Assert
      await expect(service.updateAirportsFromAirline('non-existent', [mockAirport.id]))
        .rejects.toThrow('Airline not found');
      expect(mockPrismaService.airline.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.airline.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should delete an airport from an airline successfully', async () => {
      // Arrange
      const deletedRelation = {
        airlineId: mockAirline.id,
        airportId: mockAirport.id,
      };
      mockPrismaService.airlineAirport.findFirst.mockResolvedValueOnce(mockAirlineAirport);
      mockPrismaService.airlineAirport.delete.mockResolvedValueOnce(deletedRelation);

      // Act
      const result = await service.deleteAirportFromAirline(mockAirline.id, mockAirport.id);

      // Assert
      expect(mockPrismaService.airlineAirport.findFirst).toHaveBeenCalledWith({
        where: {
          airlineId: mockAirline.id,
          airportId: mockAirport.id,
        },
      });
      expect(mockPrismaService.airlineAirport.delete).toHaveBeenCalledWith({
        where: {
          airlineId_airportId: {
            airlineId: mockAirline.id,
            airportId: mockAirport.id,
          },
        },
      });
      expect(result).toEqual(deletedRelation);
    });

    it('should throw NotFoundException when relation does not exist', async () => {
      // Arrange
      mockPrismaService.airlineAirport.findFirst.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.deleteAirportFromAirline(mockAirline.id, 'non-existent'))
        .rejects.toThrow(new NotFoundException('Airport not associated with airline'));
      expect(mockPrismaService.airlineAirport.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.airlineAirport.delete).not.toHaveBeenCalled();
    });
  });
});