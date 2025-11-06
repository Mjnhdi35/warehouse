import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';
import type { PasswordHasher } from '../../modules/auth/interfaces/password-hasher.interface';

@Injectable()
export class BcryptService implements PasswordHasher {
  constructor(private readonly configService: ConfigService) {}

  async hash(plain: string): Promise<string> {
    const rounds = +this.configService.getOrThrow<number>('SALTS');
    return bcryptHash(plain, rounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcryptCompare(plain, hashed);
  }
}
