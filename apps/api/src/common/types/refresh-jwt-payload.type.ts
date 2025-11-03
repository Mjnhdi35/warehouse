export type RefreshJwtPayload = {
  sub: string;
  email: string;
  name?: string;
  exp: number;
};
