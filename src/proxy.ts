import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16: "proxy" thay cho "middleware". Dùng cấu hình Edge-safe
// (không đụng Prisma/bcrypt) để bảo vệ khu vực /admin.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
