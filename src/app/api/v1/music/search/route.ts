import { NextRequest, NextResponse } from 'next/server';
import { searchMusic } from '@/lib/actions/musicActions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }
  try {
    const result = await searchMusic(query);
    if (!result) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}