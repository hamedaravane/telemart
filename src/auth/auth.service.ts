import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(telegramId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { telegramId } });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async login(telegramId: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(telegramId);
    const payload = { id: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(
    telegramId: string,
    name: string,
  ): Promise<{ accessToken: string }> {
    let user = await this.usersRepository.findOne({ where: { telegramId } });

    if (!user) {
      user = this.usersRepository.create({ telegramId, name });
      await this.usersRepository.save(user);
    }

    const payload = { id: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
