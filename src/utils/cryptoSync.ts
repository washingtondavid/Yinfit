// Secure Client-Side AES-256-GCM Encryption & Cloud Sync Engine using Web Crypto API

export interface EncryptedVaultPayload {
  version: string;
  iv: string; // Base64
  salt: string; // Base64
  ciphertext: string; // Base64
  timestamp: string;
  profileCount: number;
}

// Derive AES-256 key from user passphrase using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Encrypt payload with passphrase
export async function encryptAppData(data: any, passphrase: string = 'QiVitality2026!'): Promise<EncryptedVaultPayload> {
  const enc = new TextEncoder();
  const rawData = enc.encode(JSON.stringify(data));

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    rawData
  );

  return {
    version: '1.0.0',
    iv: bufferToBase64(iv.buffer as ArrayBuffer),
    salt: bufferToBase64(salt.buffer as ArrayBuffer),
    ciphertext: bufferToBase64(encryptedBuffer),
    timestamp: new Date().toISOString(),
    profileCount: Array.isArray(data?.profiles) ? data.profiles.length : 1,
  };
}

// Decrypt payload with passphrase
export async function decryptAppData(vault: EncryptedVaultPayload, passphrase: string = 'QiVitality2026!'): Promise<any> {
  const salt = base64ToBuffer(vault.salt);
  const iv = base64ToBuffer(vault.iv);
  const ciphertext = base64ToBuffer(vault.ciphertext);

  const key = await deriveKey(passphrase, salt);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  );

  const dec = new TextDecoder();
  const jsonStr = dec.decode(decryptedBuffer);
  return JSON.parse(jsonStr);
}

// Export encrypted backup to downloadable JSON file
export function downloadEncryptedVault(vault: EncryptedVaultPayload, filename: string = 'qiposture_vault_secure.json') {
  const blob = new Blob([JSON.stringify(vault, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
