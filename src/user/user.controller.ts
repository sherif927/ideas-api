import { Controller, Post, Body, Get, Param, ParseUUIDPipe, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { UserService } from './services/user.service';
import { RegistrationModel } from './models/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.user.dec';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@AuthUser() user) {
    return user;
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() creds: RegistrationModel) {
    return this.userService.register(creds);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.findById(id);
  }

}
