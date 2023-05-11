import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  getHello(): string {
    
    return this.configService.get<string>('database') || 'did not find config';
  }

  constructor(private configService: ConfigService) {}
}
