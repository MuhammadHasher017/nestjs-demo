import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';
import { BookingStatus } from '../bookings.enums';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'consumer_id' })
  consumer: User;

  @Column({ type: 'uuid' })
  consumer_id: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'uuid' })
  service_id: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.IN_PROGRESS,
  })
  status: string;

  @Column()
  paid: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
