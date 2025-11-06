import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from './interfaces/password-hasher.interface';
import { RedisService } from '../../redis/redis.service';
import { generateRandomToken, RESET_PASSWORD_TOKEN_TTL } from '../../common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await this.passwordHasher.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async requestPasswordReset(email: string): Promise<{ token: string }> {
    try {
      await this.usersService.findOneByEmail(email);
    } catch {
      throw new NotFoundException('If email exists, reset link will be sent');
    }

    const resetToken = generateRandomToken(32);

    const resetTokenKey = `reset-password:${resetToken}`;
    await this.redisService.set(resetTokenKey, email, RESET_PASSWORD_TOKEN_TTL);

    return { token: resetToken };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetTokenKey = `reset-password:${token}`;
    const email = await this.redisService.get<string>(resetTokenKey);

    if (!email) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const user = await this.usersService.findOneByEmail(email);
    const hashedPassword = await this.passwordHasher.hash(newPassword);

    await this.usersService.update(user.id, { password: hashedPassword });

    await this.redisService.del(resetTokenKey);
  }

  async validateGoogleUser(googleUser: {
    email: string;
    displayName: string;
    avatar?: string;
  }) {
    return this.usersService.findOneByEmailOrCreate(googleUser.email, {
      displayName: googleUser.displayName,
      avatar: googleUser.avatar,
    });
  }
}
