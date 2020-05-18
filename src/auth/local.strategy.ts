import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private jwtService: JwtService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.login(username, password);
    if (!user) throw new UnauthorizedException();
    const payload = { username: user.username, sub: user.id };
    const access_token: string = this.jwtService.sign(payload);
    user['token'] = access_token;
    return user;
  }
}