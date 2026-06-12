import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tags } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';
import { generateSlug } from '@/lib/utils';

// GET /api/tags - 获取标签列表
export async function GET() {
  try {
    const result = await db.select().from(tags).orderBy(desc(tags.usageCount));
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json({ success: false, error: '获取标签失败' }, { status: 500 });
  }
}

// POST /api/tags - 创建标签
export const POST = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, color, category } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: '标签名不能为空' }, { status: 400 });
    }

    const slug = generateSlug(name);

    const [newTag] = await db.insert(tags).values({
      name,
      slug,
      description: description || null,
      color: color || null,
      category: category || null,
    }).returning();

    return NextResponse.json({ success: true, data: newTag }, { status: 201 });
  } catch (error) {
    console.error('Create tag error:', error);
    return NextResponse.json({ success: false, error: '创建标签失败' }, { status: 500 });
  }
});
