import { Test, TestingModule } from '@nestjs/testing';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';

describe('AirportController', () => {
  let controller: AirportController;
  let service: AirportService;

  const mockAirportService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirportController],
      providers: [
        {
          provide: AirportService,
          useValue: mockAirportService,
        },
      ],
    }).compile();

    controller = module.get<AirportController>(AirportController);
    service = module.get<AirportService>(AirportService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return array of airports', async () => {
    const result = [{ id: '1', name: 'Airport 1' }];
    mockAirportService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(mockAirportService.findAll).toHaveBeenCalled();
  });

  it('should call findOne with correct id', async () => {
    const result = { id: '1', name: 'Airport 1' };
    mockAirportService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
    expect(mockAirportService.findOne).toHaveBeenCalledWith('1');
  });

  it('should call create with DTO and return created airport', async () => {
    const dto = {
      name: 'Airport 2',
      code: 'XYZ',
      country: 'Country',
      city: 'City',
    };
    mockAirportService.create.mockResolvedValue(dto);

    expect(await controller.create(dto)).toBe(dto);
    expect(mockAirportService.create).toHaveBeenCalledWith(dto);
  });

  it('should call update with id and DTO and return updated airport', async () => {
    const id = '1';
    const dto = { city: 'New City' };
    const updated = { id, ...dto };
    mockAirportService.update.mockResolvedValue(updated);

    expect(await controller.update(id, dto)).toBe(updated);
    expect(mockAirportService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should call delete with correct id', async () => {
    const id = '1';
    mockAirportService.delete.mockResolvedValue(undefined);

    expect(await controller.delete(id)).toBeUndefined();
    expect(mockAirportService.delete).toHaveBeenCalledWith(id);
  });
});
