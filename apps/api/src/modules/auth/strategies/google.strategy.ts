import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport-google-oauth20';
import { GoogleUser, extractEmailUsername } from '../../../common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const photo = photos?.[0]?.value;

    if (!email) {
      return done(new Error('Email not found in Google profile'), undefined);
    }

    const user: GoogleUser = {
      googleId: id,
      email,
      displayName: displayName || extractEmailUsername(email),
      avatar: photo,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
