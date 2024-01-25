import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { HttpModule } from '@nestjs/axios';
import { Service } from './entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), HttpModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
