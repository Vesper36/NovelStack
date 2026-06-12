import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reports } from '@/lib/db/schema';
import { withOptionalAuth } from '@/lib/auth/middleware';

// POST /api/reports - 提交举报
export const POST = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const body = await req.json();
    const { targetType, targetId, reason, description } = body;

    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ success: false, error: '请填写必要信息' }, { status: 400 });
    }

    const [newReport] = await db.insert(reports).values({
      reporterId: req.user.userId,
      targetType,
      targetId,
      reason,
      description: description || null,
    }).returning();

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ success: false, error: '提交举报失败' }, { status: 500 });
  }
});
