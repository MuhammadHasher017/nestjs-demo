import { BookingStatus } from '../bookings.enums';

export class CreateBookingDto {
  paid: boolean;
  consumer_id: string;
  service_id: string;
  status: BookingStatus;
}
