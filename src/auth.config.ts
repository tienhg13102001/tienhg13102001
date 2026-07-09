import type { NextAuthConfig } from "next-auth";

/**
 * Cấu hình Auth.js an toàn cho Edge (middleware) — KHÔNG import Prisma/bcrypt ở đây.
 * Provider Credentials (dùng Node API) được thêm trong `src/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    /** Bảo vệ mọi route /admin (trừ trang login). */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isOnLogin = pathname.startsWith("/admin/login");
      const isOnAdmin = pathname.startsWith("/admin");

      if (isOnLogin) return true;
      if (isOnAdmin) return isLoggedIn; // false -> Auth.js redirect về signIn page
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
