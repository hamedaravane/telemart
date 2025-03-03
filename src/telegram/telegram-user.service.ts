import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { WebAppInitData, WebAppUser } from './types';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

const DEFAULT24HOURS = 86400;

@ApiTags('Telegram User')
@Injectable()
export class TelegramUserService {
  private readonly TELEGRAM_BOT_TOKEN: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new InternalServerErrorException();
    this.TELEGRAM_BOT_TOKEN = token;
  }

  /**
   * Validates the Telegram Init Data for user authentication
   * @param initData The initialization data received from Telegram Web App
   * @param maxAgeSeconds Maximum age (in seconds) for the authentication data
   * @returns Validated WebAppInitData
   */
  @ApiOperation({
    summary: 'Validate Telegram Init Data',
    description:
      'Checks the integrity and validity of the init data from Telegram Web App.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully validated Telegram Init Data',
  })
  validateTelegramInitData(
    initData: string,
    maxAgeSeconds: number = DEFAULT24HOURS,
  ): WebAppInitData {
    const params = new URLSearchParams(initData);
    const data: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      data[key] = value;
    }

    const receivedHash = data.hash;
    if (!receivedHash) {
      throw new BadRequestException('Missing hash parameter');
    }
    delete data.hash;

    const sortedKeys = Object.keys(data).sort();
    const dataCheckString = sortedKeys
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(this.TELEGRAM_BOT_TOKEN)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== receivedHash) {
      throw new BadRequestException('Data integrity check failed');
    }

    if (data.auth_date) {
      const authDate = parseInt(data.auth_date, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime - authDate > maxAgeSeconds) {
        throw new BadRequestException('Data is outdated');
      }
    }

    return {
      auth_date: data.auth_date ? parseInt(data.auth_date, 10) : 0,
      hash: receivedHash,
      query_id: data.query_id,
      start_param: data.start_param,
      chat_instance: data.chat_instance,
      can_send_after: data.can_send_after
        ? parseInt(data.can_send_after, 10)
        : undefined,
      chat_type: data.chat_type as WebAppInitData['chat_type'],
      user: data.user ? safeJsonParse(data.user) : undefined,
      receiver: data.receiver ? safeJsonParse(data.receiver) : undefined,
      chat: data.chat ? safeJsonParse(data.chat) : undefined,
      signature: data.signature,
    };
  }

  /**
   * Validates the Telegram Init Data and extracts the authenticated user.
   * @param initData The initialization data received from Telegram Web App
   * @returns WebAppUser The authenticated user
   */
  @ApiOperation({
    summary: 'Validate and Get User',
    description:
      'Validates Telegram Web App init data and extracts the user details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully validated and retrieved user data',
  })
  validateAndGetUser(initData: string): WebAppUser {
    const webAppInitData: WebAppInitData =
      this.validateTelegramInitData(initData);

    if (!webAppInitData.user) {
      throw new BadRequestException(
        'User information is missing from the init data',
      );
    }
    if (webAppInitData.user.is_bot) {
      throw new BadRequestException('Bots are not allowed');
    }

    return webAppInitData.user;
  }
}

/**
 * Safely parses a JSON string to an object.
 * @param jsonString The JSON string to parse
 * @returns Parsed object or undefined if parsing fails
 */
function safeJsonParse<T>(jsonString: string): T | undefined {
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return undefined;
  }
}
