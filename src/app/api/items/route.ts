import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      where: {
        status: {
          not: 'resolved',
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
