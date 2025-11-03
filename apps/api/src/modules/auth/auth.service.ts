import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dtos/user.dto';
import { TokensService } from './tokens.service';
import { LoginDto } from './dtos/login.dto';
import { BcryptService } from '../../common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly bcryptService: BcryptService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await this.bcryptService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(body: LoginDto) {
    const user = await this.validateUser(body.email, body.password);
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
