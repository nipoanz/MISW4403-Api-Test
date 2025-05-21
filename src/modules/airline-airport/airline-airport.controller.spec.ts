import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportController } from './airline-airport.controller';
import { AirlineAirportService } from './airline-airport.service';

describe('AirlineAirportController', () => {
  let controller: AirlineAirportController;
  let service: AirlineAirportService;

  const mockService = {
    addAirportToAirline: jest.fn(),
    findAirportsFromAirline: jest.fn(),
    findAirportFromAirline: jest.fn(),
    updateAirportsFromAirline: jest.fn(),
    deleteAirportFromAirline: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlineAirportController],
      providers: [
        {
          provide: AirlineAirportService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AirlineAirportController>(AirlineAirportController);
    service = module.get<AirlineAirportService>(AirlineAirportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('should call service.addAirportToAirline with correct params', async () => {
      mockService.addAirportToAirline.mockResolvedValue('result');

      const result = await controller.addAirportToAirline(
        'airline1',
        'airport1',
      );

      expect(mockService.addAirportToAirline).toHaveBeenCalledWith(
        'airline1',
        'airport1',
      );
      expect(result).toBe('result');
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should call service.findAirportsFromAirline with correct param', async () => {
      mockService.findAirportsFromAirline.mockResolvedValue([
        'airport1',
        'airport2',
      ]);

      const result = await controller.findAirportsFromAirline('airline1');

      expect(mockService.findAirportsFromAirline).toHaveBeenCalledWith(
        'airline1',
      );
      expect(result).toEqual(['airport1', 'airport2']);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should call service.findAirportFromAirline with correct params', async () => {
      mockService.findAirportFromAirline.mockResolvedValue('airport1');

      const result = await controller.findAirportFromAirline(
        'airline1',
        'airport1',
      );

      expect(mockService.findAirportFromAirline).toHaveBeenCalledWith(
        'airline1',
        'airport1',
      );
      expect(result).toBe('airport1');
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should call service.updateAirportsFromAirline with correct params', async () => {
      mockService.updateAirportsFromAirline.mockResolvedValue('updated');

      const body = { airportIds: ['airport1', 'airport2'] };
      const result = await controller.updateAirportsFromAirline(
        'airline1',
        body,
      );

      expect(mockService.updateAirportsFromAirline).toHaveBeenCalledWith(
        'airline1',
        body.airportIds,
      );
      expect(result).toBe('updated');
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should call service.deleteAirportFromAirline with correct params', async () => {
      mockService.deleteAirportFromAirline.mockResolvedValue('deleted');

      const result = await controller.deleteAirportFromAirline(
        'airline1',
        'airport1',
      );

      expect(mockService.deleteAirportFromAirline).toHaveBeenCalledWith(
        'airline1',
        'airport1',
      );
      expect(result).toBe('deleted');
    });
  });
});
