import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const claims = await prisma.claim.findMany({
      where: { userId: session.user.id },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(claims);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}
