import { UserRole } from '../user.enums';

export class CreateUserDto {
  id?: string;
  email: string;
  password: string;
  last_name?: string;
  first_name?: string;
  role?: UserRole;
}
