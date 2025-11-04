/**
 * Generate a secure random token
 * @param length - Length of the token (default: 32)
 * @returns Random token string
 */
export function generateRandomToken(length: number = 32): string {
  return (
    Math.random().toString(36).slice(-length) + Date.now().toString(36)
  ).slice(0, length);
}

/**
 * Generate a random password for OAuth users
 * @returns Random password string
 */
export function generateRandomPassword(): string {
  const part1 = Math.random().toString(36).slice(-12);
  const part2 = Math.random().toString(36).slice(-12);
  const timestamp = Date.now().toString(36);
  return part1 + part2 + timestamp;
}
