import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationModel, LoginModel, UserModel } from '../models/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) { }

  async login(username: string, password: string): Promise<UserModel> {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (!existingUser || !existingUser.comparePasswords(password))
      return null;
    return existingUser.toResponseObject();
  }

  async register(creds: RegistrationModel): Promise<UserModel> {
    const newUser = this.userRepository.create(creds);
    await this.userRepository
      .save(newUser)
      .catch(e => { throw new HttpException(e.message, HttpStatus.BAD_REQUEST) });
    const payload = { username: newUser.username, sub: newUser.id };
    const access_token: string = this.jwtService.sign(payload);
    const response = newUser.toResponseObject();
    response['token'] = access_token;
    return response;
  }

  async findAll(): Promise<UserModel[]> {
    const users = await this.userRepository.find();
    return users.map(user => user.toResponseObject());
  }

  async findById(id: string): Promise<UserModel> {
    const user = await this.userRepository.findOne({ id });
    if (!user) throw new NotFoundException();
    return user.toResponseObject();
  }

  async findBy(query: any): Promise<UserModel> {
    const user = await this.userRepository.findOne({ where: query });
    if (!user) return null;
    return user.toResponseObject();
  }

}
