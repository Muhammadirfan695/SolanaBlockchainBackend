import { Buffer } from 'buffer';

const getKey = async (deviceId: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(deviceId),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('whales-x-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

export async function encrypt(data: string, deviceId: string): Promise<string> {
  const key = await getKey(deviceId);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encoder.encode(data)
  );

  const encryptedContentArr = new Uint8Array(encryptedContent);
  const buff = new Uint8Array(iv.byteLength + encryptedContentArr.byteLength);
  buff.set(iv, 0);
  buff.set(encryptedContentArr, iv.byteLength);

  return Buffer.from(buff).toString('base64');
}

export async function decrypt(encryptedData: string, deviceId: string): Promise<string> {
  const key = await getKey(deviceId);
  const decoder = new TextDecoder();
  const data = Buffer.from(encryptedData, 'base64');
  
  const iv = data.slice(0, 12);
  const content = data.slice(12);

  const decryptedContent = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    content
  );

  return decoder.decode(decryptedContent);
}