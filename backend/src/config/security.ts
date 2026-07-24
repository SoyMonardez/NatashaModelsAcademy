export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return secret;
};

export const assertSecurityEnvironment = (): void => {
  getJwtSecret();
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured');
  }
};
