import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewsRepository.create(createReviewDto);
    return this.reviewsRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.find({ relations: ['service'] });
  }

  async findOne(id: string): Promise<Review> {
    return this.reviewsRepository.findOne({
      where: { id },
      relations: ['service'],
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    await this.reviewsRepository.update(id, updateReviewDto);
    return this.reviewsRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.reviewsRepository.delete(id);
  }
}
