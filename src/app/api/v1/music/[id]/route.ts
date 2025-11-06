import { NextRequest, NextResponse } from 'next/server';
import { getMusicDetails } from '@/lib/actions/musicActions';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await getMusicDetails(id);
    if (!result) {
      return NextResponse.json({ error: 'Music not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get music details' }, { status: 500 });
  }
}