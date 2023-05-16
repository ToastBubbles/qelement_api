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
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

// @Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: ILoginDTO) {
    // const saltOrRounds = 10;

    // const isMatch = await bcrypt.compare(password, hash);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
