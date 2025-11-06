import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';

function cleanupJsFiles() {
  const dir = process.cwd();
  fs.readdir(dir, (err, files) => {
    if (err) return;
    files.forEach(file => {
      if (file.endsWith('.js') && file.includes('player-script')) {
        fs.unlink(path.join(dir, file), () => {});
      }
    });
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getBasicInfo(videoUrl);
    if (!info) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    const stream = ytdl(videoUrl, {
      filter: 'videoandaudio',
      quality: 'lowest',
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      },
    });
    const response = new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'video/mp4',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Accept-Ranges': 'bytes',
      },
    });
    return response;
  } catch (error: any) {
    console.error('Streaming error:', error);
    cleanupJsFiles();
    if (error.statusCode === 410) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Streaming failed' }, { status: 500 });
  }
}