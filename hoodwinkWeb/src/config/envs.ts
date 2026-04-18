import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
  VITE_FRONTEND_URL: z.url(),
  VITE_GAMESERVER_URL: z.url(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
});

export const ENV = envSchema.parse(import.meta.env);
