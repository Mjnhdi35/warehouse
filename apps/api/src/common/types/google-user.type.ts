export interface GoogleUser {
  googleId: string;
  email: string;
  displayName: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
}
