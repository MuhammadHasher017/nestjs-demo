import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { Public } from '../auth/auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Public()
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.validateUser(
      createUserDto.email,
      createUserDto.password,
    );
    if (!user) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }
    const token = await this.usersService.login(user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: token,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
