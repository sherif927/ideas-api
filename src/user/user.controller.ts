import { Controller, Post, Body, Get, Param, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './services/user.service';
import { LoginModel, RegistrationModel } from './models/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() creds: LoginModel) {
    return this.userService.login(creds);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() creds: RegistrationModel) {
    return this.userService.register(creds);
  }

  @Get()
  async getUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.findById(id);
  }

}
