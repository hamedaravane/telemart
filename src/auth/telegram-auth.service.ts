import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthService {
  /**
   * Validates the Telegram auth data.
   * @param authData - Object containing Telegram auth fields (id, first_name, hash, etc.)
   */
  validateTelegramData(authData: Record<string, any>): boolean {
    const { hash, ...data } = authData;
    const dataCheckString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (hmac !== hash) {
      throw new UnauthorizedException('Invalid Telegram auth data');
    }
    return true;
  }
}
