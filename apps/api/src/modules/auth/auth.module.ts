import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RedisModule } from '../../redis/redis.module';
import { TokensService } from './tokens.service';
import { RefreshTokenStore } from './refresh-token.store';
import { TOKEN_STORE } from './interfaces/token-store.interface';
import { BcryptService } from '../../common';
import { PASSWORD_HASHER } from './interfaces/password-hasher.interface';
import { AuthFacade } from './auth.facade';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: +config.getOrThrow<number>('JWT_EXPIRES'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthFacade,
    JwtStrategy,
    GoogleStrategy,
    TokensService,
    { provide: PASSWORD_HASHER, useClass: BcryptService },
    { provide: TOKEN_STORE, useClass: RefreshTokenStore },
  ],
})
export class AuthModule {}
