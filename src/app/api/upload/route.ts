import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file tải lên." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const imgbbApiKey = process.env.IMGBB_API_KEY;
    if (!imgbbApiKey) {
      console.error("Thiếu cấu hình IMGBB_API_KEY trong .env");
      return NextResponse.json(
        { error: "Lỗi cấu hình server." },
        { status: 500 }
      );
    }

    // Upload to ImgBB using FormData
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", base64Image);

    // Note: Optionally add name to ImgBB
    // const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    // imgbbFormData.append("name", originalName);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: "POST",
      body: imgbbFormData,
    });

    const data = await imgbbResponse.json();

    if (!data.success) {
      console.error("Lỗi từ ImgBB:", data);
      throw new Error(data.error?.message || "Lỗi từ ImgBB");
    }

    // data.data.url contains the direct image link (e.g., https://i.ibb.co/...)
    const fileUrl = data.data.url;

    return NextResponse.json({ url: fileUrl });
  } catch (e) {
    console.error("Lỗi khi upload file:", e);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xử lý upload." },
      { status: 500 }
    );
  }
}
