import { NextRequest, NextResponse } from 'next/server';
import { getLyrics } from '@/lib/actions/musicActions';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`);
    const data = await response.json();
    if (!data.items.length) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    const video = data.items[0];
    const title = video.snippet.title;
    const artist = title.split(' - ')[1] || 'Unknown';
    const songName = title.split(' - ')[0] || title;
    const lyrics = await getLyrics(id, songName, artist);
    if (!lyrics) {
      return NextResponse.json({ error: 'Lyrics not found' }, { status: 404 });
    }
    return NextResponse.json({ lyrics });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get lyrics' }, { status: 500 });
  }
}