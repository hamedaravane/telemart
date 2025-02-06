import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body('telegramId') telegramId: string) {
    return this.authService.login(telegramId);
  }

  @Post('register')
  async register(
    @Body('telegramId') telegramId: string,
    @Body('name') name: string,
  ) {
    return this.authService.register(telegramId, name);
  }
}
