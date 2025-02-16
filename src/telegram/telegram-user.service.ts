import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { WebAppInitData, WebAppUser } from './types';

const DEFAULT24HOURS = 86400;

@Injectable()
export class TelegramUserService {
  validateTelegramInitData(
    initData: string,
    botToken: string,
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
      .update(botToken)
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

  validateAndGetUser(initData: string, botToken: string): WebAppUser {
    const webAppInitData: WebAppInitData = this.validateTelegramInitData(
      initData,
      botToken,
    );

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

function safeJsonParse<T>(jsonString: string): T | undefined {
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return undefined;
  }
}
