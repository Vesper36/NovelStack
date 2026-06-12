import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { isValidEmail } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: '密码至少 8 位' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: '该邮箱已注册' },
        { status: 409 }
      );
    }

    // 创建用户
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
      emailVerified: null,
      role: 'author',
    }).returning();

    // 签发 JWT
    const token = await signToken({
      userId: newUser.id,
      email: newUser.email!,
      role: newUser.role!,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
