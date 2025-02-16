import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate, parse, ValidateValue } from '@telegram-apps/init-data-node';
import { InitData } from '@telegram-apps/types';

export type TelegramAuthResult =
  | { success: true; data: InitData }
  | { success: false; error: string };

@Injectable()
export class TelegramAuthService {
  private readonly botToken: string;
  private readonly logger = new Logger(TelegramAuthService.name);

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set in configuration.');
    }
    this.botToken = token;
  }

  validateTelegramData(authData: ValidateValue): TelegramAuthResult {
    try {
      validate(authData, this.botToken);

      const initData: InitData = parse(authData);

      if (initData.user && initData.user.is_bot) {
        return { success: false, error: 'Bots are not allowed.' };
      }

      return { success: true, data: initData };
    } catch (error) {
      this.logger.error('Failed to validate Telegram init data', error);
      return { success: false, error: 'Invalid Telegram auth data.' };
    }
  }
}
