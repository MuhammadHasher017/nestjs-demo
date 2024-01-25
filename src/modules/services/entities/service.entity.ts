import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'merchant_id' }) // This line is added
  merchant: User;

  @Column({ type: 'uuid' }) // This line is added
  merchant_id: string; // This line is added

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
