import crypto = require("crypto");

export class PasswordHasher {
  public static create(): PasswordHasher {
    return new PasswordHasher();
  }

  public hash(password: string): string {
    return crypto.createHash('sha256').update(password).digest('base64');
  }
}
