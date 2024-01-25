import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingStatus } from './bookings.enums';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((booking) =>
        Promise.resolve({ id: Date.now(), ...booking }),
      ),
    find: jest.fn().mockImplementation(() => Promise.resolve([])),
    findOne: jest
      .fn()
      .mockImplementation(({ where: { id } }) =>
        Promise.resolve(id ? { id } : null),
      ),
    update: jest.fn().mockImplementation(() => Promise.resolve()),
    delete: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new record and return that ', async () => {
    const dto: CreateBookingDto = {
      consumer_id: '916048b3-8624-4934-869a-a2fa9bde9af2',
      service_id: '0cd1042b-0032-4562-882f-970e74122a95',
      status: BookingStatus.IN_PROGRESS,
      paid: false,
    };
    expect(await service.create(dto));
  });

  it('should return an array of bookings', async () => {
    const result = await service.findAll();
    expect(result).toBeInstanceOf(Array);
    expect(mockBookingRepository.find).toHaveBeenCalled();
  });

  it('should return a single booking object', async () => {
    const id = 'some-booking-id';
    const result = await service.findOne(id);
    expect(result).toBeDefined();
    expect(result.id).toBe(id);
    expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['consumer', 'service'],
    });
  });

  it('should return null if booking is not found', async () => {
    const id = 'non-existent-id';
    mockBookingRepository.findOne.mockReturnValueOnce(null);
    const result = await service.findOne(id);
    expect(result).toBeNull();
  });

  it('should update and return the booking', async () => {
    const id = 'some-booking-id';
    const updateBookingDto = {};
    const result = await service.update(id, updateBookingDto);
    expect(mockBookingRepository.update).toHaveBeenCalledWith(
      id,
      updateBookingDto,
    );
    expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
