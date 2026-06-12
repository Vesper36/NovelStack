import { NextResponse } from 'next/server';
import { searchWorks } from '@/lib/db/queries';

// GET /api/search?q=xxx&limit=20
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    if (!query || query.length < 2) {
      return NextResponse.json({ success: false, error: '搜索词至少 2 个字符' }, { status: 400 });
    }

    const results = await searchWorks(query, limit);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: '搜索失败' }, { status: 500 });
  }
}
