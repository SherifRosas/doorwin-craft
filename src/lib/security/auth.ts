import { hash as argonHash, verify as argonVerify } from 'argon2';
import jwt from 'jsonwebtoken';
import { RateLimiter } from 'limiter';

export class SecurityManager {
  private static readonly JWT_SECRET = process.env.JWT_SECRET as string;
  private static readonly TOKEN_TTL = '12h';

  // Basic rate limiter: 5 tokens/minute (adjust per endpoint)
  private static loginLimiter = new RateLimiter(5, 'minute');

  static async hashPassword(password: string): Promise<string> {
    return argonHash(password);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return argonVerify(hash, password);
  }

  static generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.TOKEN_TTL,
      issuer: 'doorwin-craft',
      audience: 'doorwin-users'
    });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, this.JWT_SECRET, {
      issuer: 'doorwin-craft',
      audience: 'doorwin-users'
    });
  }

  static async checkLoginRateLimit(): Promise<boolean> {
    try {
      await this.loginLimiter.removeTokens(1);
      return true;
    } catch {
      return false;
    }
  }
}






