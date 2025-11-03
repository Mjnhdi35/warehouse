import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Inject } from '@nestjs/common';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from './interfaces/password-hasher.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await this.passwordHasher.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
