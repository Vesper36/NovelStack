import { NextResponse } from 'next/server';
import { withOptionalAuth } from '@/lib/auth/middleware';

// POST /api/upload - 文件上传
export const POST = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: '请选择文件' }, { status: 400 });
    }

    // 文件大小限制 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: '文件不能超过 10MB' }, { status: 400 });
    }

    // 允许的文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: '仅支持 JPEG/PNG/GIF/WebP' }, { status: 400 });
    }

    // 生成文件名
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // 保存到 public/uploads
    const buffer = await file.arrayBuffer();
    const { writeFile, mkdir } = await import('fs/promises');
    const { join } = await import('path');

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, fileName), Buffer.from(buffer));

    const url = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, data: { url, fileName } });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: '上传失败' }, { status: 500 });
  }
});
