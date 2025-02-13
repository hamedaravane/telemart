import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthService {
  private secretKey: Buffer;

  validateTelegramData(authData: Record<string, any>): boolean {
    const { hash, ...data } = authData;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN environment variable is not defined');
    }

    if (!this.secretKey) {
      this.secretKey = crypto.createHash('sha256').update(botToken).digest();
    }

    const dataCheckString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const hmac = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (hmac !== hash) {
      throw new UnauthorizedException('Invalid Telegram auth data');
    }
    return true;
  }
}
