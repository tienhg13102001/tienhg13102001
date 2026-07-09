import { PrismaClient } from "@prisma/client";
import { readdir, readFile, unlink } from "fs/promises";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

async function uploadToImgBB(filepath: string, filename: string): Promise<string> {
  const imgbbApiKey = process.env.IMGBB_API_KEY;
  if (!imgbbApiKey) throw new Error("Missing IMGBB_API_KEY");

  const buffer = await readFile(filepath);
  const base64Image = buffer.toString("base64");

  const formData = new FormData();
  formData.append("image", base64Image);
  formData.append("name", filename);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Lỗi từ ImgBB");
  }

  return data.data.url;
}

async function main() {
  console.log("🚀 Bắt đầu quá trình di chuyển ảnh lên ImgBB...");

  try {
    const files = await readdir(UPLOAD_DIR);
    console.log(`Đã tìm thấy ${files.length} file trong thư mục uploads.`);

    for (const file of files) {
      if (file.endsWith(".pdf") || file.startsWith(".")) {
        console.log(`⏩ Bỏ qua file: ${file}`);
        continue;
      }

      console.log(`\n⏳ Đang xử lý ảnh: ${file}`);
      const filepath = join(UPLOAD_DIR, file);
      
      try {
        // 1. Upload to ImgBB
        const newUrl = await uploadToImgBB(filepath, file);
        console.log(`✅ Upload thành công lên ImgBB: ${newUrl}`);

        const oldPath = `/uploads/${file}`;

        // 2. Update Database (Profile)
        const profile = await prisma.profile.findFirst();
        if (profile) {
          if (profile.avatarUrl === oldPath) {
            await prisma.profile.update({
              where: { id: profile.id },
              data: { avatarUrl: newUrl }
            });
            console.log(`   -> Đã cập nhật Profile Avatar`);
          }
        }

        // 3. Update Database (Projects)
        const projects = await prisma.project.findMany({
          where: { coverImage: oldPath }
        });
        for (const p of projects) {
          await prisma.project.update({
            where: { id: p.id },
            data: { coverImage: newUrl }
          });
          console.log(`   -> Đã cập nhật Project: ${p.title}`);
        }

        // 4. Update Database (Posts)
        const posts = await prisma.post.findMany({
          where: { coverImage: oldPath }
        });
        for (const p of posts) {
          await prisma.post.update({
            where: { id: p.id },
            data: { coverImage: newUrl }
          });
          console.log(`   -> Đã cập nhật Blog Post: ${p.title}`);
        }

        // 5. Xóa file cục bộ
        await unlink(filepath);
        console.log(`🗑️ Đã xóa file cục bộ: ${file}`);

      } catch (err) {
        console.error(`❌ Lỗi khi xử lý file ${file}:`, err);
      }
    }

    console.log("\n🎉 Quá trình di chuyển hoàn tất!");
  } catch (err) {
    console.error("Lỗi khi đọc thư mục uploads:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
