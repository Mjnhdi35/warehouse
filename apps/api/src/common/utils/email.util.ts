/**
 * Extract username from email address
 * @param email - Email address
 * @returns Username (part before @)
 */
export function extractEmailUsername(email: string): string {
  return email.split('@')[0];
}
