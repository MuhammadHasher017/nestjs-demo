import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../auth/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ERRORS } from '../../utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const check = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (check) {
        throw new ConflictException(ERRORS.EMAIL_ALREADY_USED);
      }

      const HASH_NUMBER = this.configService.get('hashNumber');
      const salt = await bcrypt.genSalt(Number(HASH_NUMBER));

      const hashedPassword = await bcrypt.hash(
        createUserDto.password.toString(),
        salt,
      );
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);

      delete user.password;
      return user;
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException(ERRORS.EMAIL_ALREADY_USED);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password.toString(), user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
  async signup(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.create(createUserDto);
    } catch (error) {}
  }
  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
