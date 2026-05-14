import type { auth } from "../../lib/auth";

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

declare global {
  namespace Express {
    interface Request {
      auth?: NonNullable<AuthSession>;
    }
  }
}

export {};
