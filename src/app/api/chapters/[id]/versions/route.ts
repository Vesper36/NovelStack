import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { draftVersions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/chapters/[id]/versions - 获取版本历史
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const versions = await db
      .select({
        id: draftVersions.id,
        version: draftVersions.version,
        title: draftVersions.title,
        createdAt: draftVersions.createdAt,
      })
      .from(draftVersions)
      .where(eq(draftVersions.chapterId, id))
      .orderBy(desc(draftVersions.version))
      .limit(limit);

    return NextResponse.json({ success: true, data: versions });
  } catch (error) {
    console.error('Get versions error:', error);
    return NextResponse.json({ success: false, error: '获取版本历史失败' }, { status: 500 });
  }
}
