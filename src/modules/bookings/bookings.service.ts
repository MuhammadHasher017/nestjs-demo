import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingsRepository.create(createBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({ relations: ['consumer', 'service'] });
  }

  async findOne(id: string): Promise<Booking> {
    return this.bookingsRepository.findOne({
      where: { id },
      relations: ['consumer', 'service'],
    });
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    await this.bookingsRepository.update(id, updateBookingDto);
    return this.bookingsRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.bookingsRepository.delete(id);
  }
}
