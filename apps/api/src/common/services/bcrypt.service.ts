import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(plain: string): Promise<string> {
    const rounds = +this.configService.getOrThrow<number>('SALTS');
    return bcryptHash(plain, rounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcryptCompare(plain, hashed);
  }
}
