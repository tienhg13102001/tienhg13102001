# Kế hoạch: Portfolio cá nhân + CMS quản lý nội dung

> Trạng thái: **Wave 0 HOÀN TẤT** ✅ · Cập nhật: 2026-07-08

## 1. Mục tiêu
Một trang portfolio cá nhân đẹp, responsive, SEO tốt, kèm **trang quản trị (`/admin`)** có đăng nhập để tự chỉnh sửa toàn bộ nội dung mà không cần đụng code. Nội dung lưu trong database, trang public đọc trực tiếp từ DB.

## 2. Công nghệ (đã chốt)
| Lớp | Lựa chọn | Lý do |
|-----|----------|-------|
| Framework | **Next.js 15** (App Router, TypeScript) | Full-stack: vừa render trang public (SEO/SSR) vừa có API/Server Actions cho CMS |
| UI | **Tailwind CSS + shadcn/ui** | Component đẹp, nhất quán, tuỳ biến nhanh |
| ORM/DB | **Prisma + Postgres (Neon free)** | Type-safe, migrate dễ, Neon free tier đủ dùng |
| Auth | **Auth.js (NextAuth) — Credentials** | 1 tài khoản admin, mật khẩu hash bcrypt, session JWT |
| Ảnh | **Vercel Blob** (hoặc dán URL ngoài) | Upload ảnh project/blog; giai đoạn đầu có thể chỉ dùng URL |
| Editor blog | **Tiptap** (rich text) hoặc Markdown | Soạn bài viết trong admin |
| Deploy | **Vercel + Neon** | Free, CI/CD tự động từ Git |

## 3. Mô hình dữ liệu (Prisma schema)
- **User** — `email`, `passwordHash` (tài khoản admin duy nhất)
- **Profile** (1 dòng, thông tin chung) — `fullName`, `title`, `tagline`, `bio`, `avatarUrl`, `email`, `location`, `socials(JSON: github/linkedin/x/...)`, `resumeUrl`
- **Skill** — `name`, `category`, `level(1-5)`, `order`
- **Project** — `title`, `slug`, `summary`, `content`, `coverImage`, `liveUrl`, `repoUrl`, `tags(string[])`, `featured(bool)`, `order`, `createdAt`
- **Experience** — `type(WORK|EDUCATION)`, `title`, `organization`, `location`, `startDate`, `endDate?`, `current(bool)`, `description`, `order`
- **Post** (blog) — `title`, `slug`, `excerpt`, `content`, `coverImage`, `tags(string[])`, `published(bool)`, `publishedAt`, `createdAt`, `updatedAt`

## 4. Bản đồ trang (routes)

### Public
- `/` — Hero + About + Skills + Featured Projects + Contact
- `/projects` — lưới dự án; `/projects/[slug]` — chi tiết
- `/experience` — timeline công việc + học vấn
- `/blog` — danh sách bài; `/blog/[slug]` — bài viết
- `/contact` — form/thông tin liên hệ

### Admin (bảo vệ bằng đăng nhập)
- `/admin/login`
- `/admin` — dashboard tổng quan
- `/admin/profile` — sửa thông tin cá nhân + socials
- `/admin/projects` — CRUD dự án
- `/admin/skills` — CRUD kỹ năng
- `/admin/experience` — CRUD kinh nghiệm & học vấn
- `/admin/blog` — CRUD bài viết (draft/publish)

## 5. Task graph — các đợt chạy song song (Execution Waves)

### Wave 0 — Nền móng (làm trước, tuần tự)
1. Khởi tạo Next.js + TypeScript + Tailwind + shadcn/ui
2. Cấu hình Prisma + Postgres (Neon), viết `schema.prisma`, chạy migrate
3. Cấu hình Auth.js (Credentials), middleware bảo vệ `/admin`, seed tài khoản admin

### Wave 1 — Song song (sau khi có nền móng)
- **A. Design system public**: layout, header/footer, theme (dark/light), typography, section components
- **B. Admin shell**: layout admin, sidebar, auth guard, trang login, dashboard rỗng
- **C. Data layer**: server actions / API cho từng entity (CRUD) + validation (zod)

### Wave 2 — Song song
- **D. Trang public đọc DB**: Home, Projects (+detail), Experience, Blog (+detail), Contact
- **E. Admin CRUD**: form Profile, Projects, Skills, Experience, Blog (dùng chung data layer từ C)
- **F. Seed dữ liệu mẫu** để xem trước

### Wave 3 — Hoàn thiện
- Upload ảnh (Vercel Blob), rich text editor cho blog
- SEO (metadata, OG image, sitemap, robots), responsive QA, accessibility
- Cấu hình deploy Vercel + biến môi trường + Neon production

### Ma trận phụ thuộc
| Task | Phụ thuộc |
|------|-----------|
| Wave 1 (A,B,C) | Wave 0 |
| D | A + C |
| E | B + C |
| F | C (schema) |
| Wave 3 | D + E |

## 6. Biến môi trường (.env)
```
DATABASE_URL=            # Neon Postgres
NEXTAUTH_SECRET=         # chuỗi random
NEXTAUTH_URL=            # http://localhost:3000 / domain prod
ADMIN_EMAIL=             # tài khoản admin seed
ADMIN_PASSWORD=          # mật khẩu ban đầu (sẽ hash)
BLOB_READ_WRITE_TOKEN=   # (khi bật upload ảnh)
```

## 7. Tiêu chí hoàn thành (Acceptance)
- [ ] Trang public hiển thị đầy đủ 5 khu vực, responsive, chạy `next build` không lỗi
- [ ] Đăng nhập `/admin` hoạt động; truy cập admin khi chưa login bị chặn
- [ ] CRUD được cả 5 nhóm nội dung; sửa ở admin → phản ánh ngay trên trang public
- [ ] Blog có draft/publish; chỉ bài published hiện ra ngoài
- [ ] Seed data hiển thị đúng
- [ ] Deploy thành công lên Vercel với Neon production

## 8. Ước lượng
- Wave 0: ~1 buổi · Wave 1: ~1 ngày · Wave 2: ~1-2 ngày · Wave 3: ~1 ngày
- Tổng: ~3-4 ngày công (nhanh hơn nhiều nếu chạy song song bằng agent)

## ✅ Nhật ký Wave 0 (hoàn tất 2026-07-08)
Đã dựng và **verify bằng `next build` (pass) + typecheck (pass)**:
- Next.js **16.2.10** (App Router, Turbopack) + React 19 + TypeScript + Tailwind **v4**
- Prisma **6.19.3** (hạ từ 7 để ổn định) + `schema.prisma` đủ 7 model (User, Profile, Skill, Project, Experience, Post) → client đã generate
- Auth.js v5 (next-auth beta): `src/auth.config.ts` (Edge-safe) + `src/auth.ts` (Credentials + bcrypt + Prisma) + route handler `/api/auth/[...nextauth]`
- Bảo vệ `/admin` qua `src/proxy.ts` (Next 16 đổi tên `middleware` → `proxy`)
- `prisma/seed.ts` (admin + Profile + skills/project/experience mẫu) — đã load-test OK
- `.env` / `.env.example`, `src/lib/prisma.ts`, `src/lib/utils.ts` (cn), type augmentation `next-auth.d.ts`
- Scripts: `db:push`, `db:migrate`, `db:seed`, `db:studio`, `db:generate`

**Để chạy thật (cần bạn làm):**
1. Tạo DB tại [neon.tech](https://neon.tech) → copy connection string vào `DATABASE_URL` trong `.env`
2. Đặt `AUTH_SECRET` (chạy `openssl rand -base64 32`) và `ADMIN_EMAIL`/`ADMIN_PASSWORD`
3. `npm run db:push` → tạo bảng · `npm run db:seed` → nạp admin + dữ liệu mẫu
4. `npm run dev` → mở http://localhost:3000

**Deviation so với plan gốc:** Prisma 6 thay vì 7 (7 bắt buộc driver adapter + `prisma.config.ts`, phức tạp cho portfolio cá nhân); `proxy.ts` thay `middleware.ts` (yêu cầu của Next 16).

## 9. Rủi ro & quyết định còn mở
- **Editor blog**: Markdown (đơn giản) vs Tiptap (WYSIWYG) — quyết định ở Wave 3
- **Upload ảnh**: bật Vercel Blob hay chỉ dán URL ở bản đầu
- **Đa ngôn ngữ (vi/en)**: hiện chưa gồm — thêm sau nếu cần
