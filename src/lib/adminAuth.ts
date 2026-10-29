export interface AdminSessionPayload {
  email: string;
  role: 'admin';
  issuedAt: number;
  expiresAt: number;
  jti: string;
}

export const ADMIN_COOKIE_NAME = 'adg_session';
export const ADMIN_CLIENT_FLAG_COOKIE = 'adg_admin_token';
export const SESSION_MAX_AGE_SECONDS = 86400; // 24 hours

// Global in-memory set of revoked token IDs (jti)
const revokedTokenIds = new Set<string>();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const secretSource =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.ADMIN_DEFAULT_PASSWORD ||
    'AfroDream2026!GlobalLogisticsAdminSessionFallbackKey';

  const secretHash = await crypto.subtle.digest(
    'SHA-256',
    enc.encode(`afrodream_admin_session_salt_${secretSource}`)
  );

  return await crypto.subtle.importKey(
    'raw',
    secretHash,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const now = Date.now();
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const jti = bytesToHex(randomBytes);

  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    role: 'admin',
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
    jti,
  };

  const enc = new TextEncoder();
  const payloadB64 = toBase64Url(enc.encode(JSON.stringify(payload)));
  const key = await getHmacKey();
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const signature = toBase64Url(new Uint8Array(sigBuffer));

  return `${payloadB64}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return null;

  try {
    const key = await getHmacKey();
    const enc = new TextEncoder();
    const sigBytes = fromBase64Url(signature);
    const dataBytes = enc.encode(payloadB64);

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as BufferSource, dataBytes);
    if (!isValid) return null;

    const dec = new TextDecoder();
    const payloadJson = dec.decode(fromBase64Url(payloadB64));
    const payload: AdminSessionPayload = JSON.parse(payloadJson);

    if (payload.role !== 'admin') return null;
    if (Date.now() > payload.expiresAt) return null;
    if (revokedTokenIds.has(payload.jti)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function revokeAdminSessionToken(token: string | undefined | null): void {
  if (!token || typeof token !== 'string') return;
  try {
    const [payloadB64] = token.split('.');
    if (!payloadB64) return;
    const dec = new TextDecoder();
    const payloadJson = dec.decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(payloadJson);
    if (payload?.jti) {
      revokedTokenIds.add(payload.jti);
    }
  } catch {
    // ignore
  }
}

export function parseCookies(cookieHeader: string | null | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((part) => {
    const [k, v] = part.trim().split('=');
    if (k && v) {
      cookies[k] = decodeURIComponent(v);
    }
  });
  return cookies;
}

export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  const token = cookies[ADMIN_COOKIE_NAME];
  const session = await verifyAdminSessionToken(token);
  return session !== null;
}
