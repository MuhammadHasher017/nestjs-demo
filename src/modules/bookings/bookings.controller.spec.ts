import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingStatus } from './bookings.enums';
import { UpdateBookingDto } from './dtos/update-booking.dto';

describe('BookingsController', () => {
  let controller: BookingsController;
  const mockBookingsService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    findAll: jest.fn().mockImplementation(() => Promise.resolve([])),
    findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id })),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockBookingsService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a booking', async () => {
    const dto: CreateBookingDto = {
      consumer_id: '916048b3-8624-4934-869a-a2fa9bde9af2',
      service_id: '0cd1042b-0032-4562-882f-970e74122a95',
      status: BookingStatus.IN_PROGRESS,
      paid: false,
    };
    await controller.create(dto);
    expect(mockBookingsService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a booking', async () => {
    const uid = Date.now().toString();
    const dto: UpdateBookingDto = {
      status: BookingStatus.IN_PROGRESS,
      paid: false,
    };
    await controller.update(uid, dto);
    expect(mockBookingsService.update).toHaveBeenCalledWith(uid, dto);
  });

  it('should return an array of bookings', async () => {
    const result = await controller.findAll();
    expect(result).toBeInstanceOf(Array);
    expect(mockBookingsService.findAll).toHaveBeenCalled();
  });

  it('should return a booking object', async () => {
    const id = '916048b3-8624-4934-869a-a2fa9bde9af2';
    const result = await controller.findOne(id);
    expect(result).toBeDefined();
    expect(result.id).toBe(id);
    expect(mockBookingsService.findOne).toHaveBeenCalledWith(id);
  });
});
