import { Test, TestingModule } from '@nestjs/testing';
import { AirlineController } from './airline.controller';
import { AirlineService } from './airline.service';
import { CreateAirlineDto } from 'src/dto/create-airline.dto';
import { UpdateAirlineDto } from 'src/dto/update-airline.dto';

describe('AirlineController', () => {
  let controller: AirlineController;
  let service: AirlineService;

  const mockAirlineService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlineController],
      providers: [
        {
          provide: AirlineService,
          useValue: mockAirlineService,
        },
      ],
    }).compile();

    controller = module.get<AirlineController>(AirlineController);
    service = module.get<AirlineService>(AirlineService);
  });

  it('should create an airline', async () => {
    const dto: CreateAirlineDto = {
      name: 'TestAir',
      description: 'Test description',
      foundingDate: new Date('2000-01-01').toISOString(),
      website: 'https://test.com',
    };
    const result = { id: 'uuid', ...dto };

    mockAirlineService.create.mockResolvedValue(result);
    expect(await controller.create(dto)).toEqual(result);
    expect(mockAirlineService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all airlines', async () => {
    const result = [{ id: 'uuid', name: 'Air1' }];
    mockAirlineService.findAll.mockResolvedValue(result);
    expect(await controller.findAll()).toEqual(result);
  });

  it('should return one airline', async () => {
    const id = 'uuid';
    const result = { id, name: 'Air1' };
    mockAirlineService.findOne.mockResolvedValue(result);
    expect(await controller.findOne(id)).toEqual(result);
  });

  it('should update an airline', async () => {
    const id = 'uuid';
    const dto: UpdateAirlineDto = { description: 'Updated' };
    const result = { id, name: 'Air1', description: 'Updated' };

    mockAirlineService.update.mockResolvedValue(result);
    expect(await controller.update(id, dto)).toEqual(result);
    expect(mockAirlineService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should delete an airline', async () => {
    const id = 'uuid';
    const result = { message: 'Deleted' };

    mockAirlineService.delete.mockResolvedValue(result);
    expect(await controller.delete(id)).toEqual(result);
  });
});
