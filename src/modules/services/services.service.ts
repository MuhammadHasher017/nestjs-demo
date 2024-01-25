import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-services.dto';
import { UpdateServiceDto } from './dtos/update-services.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.servicesRepository.create(createServiceDto);
    return this.servicesRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find();
  }

  async findOne(id: string): Promise<Service> {
    return this.servicesRepository.findOne({
      where: { id },
      relations: ['merchant'],
    });
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    await this.servicesRepository.update({ id }, updateServiceDto);
    return this.servicesRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.servicesRepository.delete({ id });
  }

  async findServicesByMerchant(merchant_id: string): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { merchant: { id: merchant_id } },
    });
  }
}
