export default function decodeJWT<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    console.log(decoded)
    return JSON.parse(decoded) as T;
  } catch (error) {
    return null;
  }
}