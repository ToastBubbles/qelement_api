import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/services/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    console.log('in signin service');

    const user = await this.usersService.findOneByUsername(username);
    if (!user?.password) return new UnauthorizedException();
    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { username: user?.name, sub: user?.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
