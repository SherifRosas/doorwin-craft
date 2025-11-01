import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV recommended for GCM

export function encryptGCM(key: Buffer, plaintext: string, aad = 'doorwin-craft') {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(Buffer.from(aad));
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${ciphertext.toString('hex')}`;
}

export function decryptGCM(key: Buffer, payload: string, aad = 'doorwin-craft') {
  const [ivHex, tagHex, dataHex] = payload.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAAD(Buffer.from(aad));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
  return plaintext.toString('utf8');
}






