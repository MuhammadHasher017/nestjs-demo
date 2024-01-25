import { BookingStatus } from '../bookings.enums';

export class UpdateBookingDto {
  status?: BookingStatus;
  paid?: boolean;
}
