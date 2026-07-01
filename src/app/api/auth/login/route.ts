import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide email and password.' }, { status: 400 });
    }

    try {
      // 1. Check database for user
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      // 2. Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      // 3. Return user session data
      return NextResponse.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError) {
      console.warn('Database error during API login check. Client will fallback to local storage.', dbError);
      return NextResponse.json({ error: 'Database query failed. Fallback to local storage.', isDbDown: true }, { status: 503 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login API failed' }, { status: 500 });
  }
}
