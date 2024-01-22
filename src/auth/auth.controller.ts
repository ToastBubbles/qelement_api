import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ILoginDTO, Public } from 'src/interfaces/general';
import { AuthService } from './auth.service';
import { StandardUserAuth } from './standard.guard';

// @Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() { username, password }: ILoginDTO) {
    return this.authService.signIn(username, password);
  }

  @UseGuards(StandardUserAuth)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
