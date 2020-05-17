import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationModel, LoginModel, UserModel } from '../models/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async login(creds: LoginModel): Promise<UserModel> {
    const { username, password } = creds;
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (!existingUser || !(await existingUser).comparePasswords(password))
      throw new BadRequestException();
    return existingUser.toResponseObject();
  }

  async register(creds: RegistrationModel): Promise<UserModel> {
    const newUser = this.userRepository.create(creds);
    await this.userRepository
      .save(newUser)
      .catch(e => { throw new HttpException(e.message, HttpStatus.BAD_REQUEST) });
    return newUser.toResponseObject();
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

}
