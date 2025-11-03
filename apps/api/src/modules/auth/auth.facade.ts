import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokensService } from './tokens.service';
import { CreateUserDto } from '../users/dtos/user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.tokensService.issueFor(user);
  }

  async register(body: CreateUserDto) {
    const exists = await this.usersService
      .findOneByEmail(body.email)
      .then(() => true)
      .catch(() => false);
    if (exists) {
      throw new ConflictException('Email already in use');
    }
    const newUser = await this.usersService.create(body);
    return this.tokensService.issueFor(newUser);
  }

  async refresh(token: string) {
    const payload = await this.tokensService.rotate(token);
    const entity = await this.usersService.findOneByEmail(payload.email);
    const { accessToken, refreshToken } =
      await this.tokensService.issueFor(entity);
    return { accessToken, refreshToken };
  }

  async logout(token: string) {
    return this.tokensService.revoke(token);
  }
}
