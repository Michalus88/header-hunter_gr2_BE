import * as crypto from 'crypto';

export const hashPwd = (password: string, salt: string): string => {
  const hmac = crypto.createHmac('sha512', salt);
  hmac.update(password);
  return hmac.digest('hex');
};
