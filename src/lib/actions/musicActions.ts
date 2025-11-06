import { searchSpotify, searchYouTube, getLyricsFromGenius, getLyricsFromYouTube } from '../functions/musicFunctions';

export async function searchMusic(query: string) {
  const spotifyData = await searchSpotify(query);
  if (!spotifyData) return null;
  const youtubeData = await searchYouTube(`${spotifyData.name} ${spotifyData.artist} official video`);
  if (!youtubeData) return null;
  return {
    ...spotifyData,
    youtubeId: youtubeData.videoId,
    youtubeTitle: youtubeData.title,
    youtubeThumbnail: youtubeData.thumbnail,
  };
}

export async function getMusicDetails(youtubeId: string) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${process.env.YOUTUBE_API_KEY}`);
  const data = await response.json();
  if (data.items.length) {
    const video = data.items[0];
    const title = video.snippet.title;
    const artist = title.split(' - ')[1] || 'Unknown';
    const songName = title.split(' - ')[0] || title;
    return {
      youtubeId,
      title: songName,
      artist,
      videoStreamUrl: `/api/v1/music/${youtubeId}/stream`,
      musicLyricsUrl: `/api/v1/music/${youtubeId}/lyrics`,
    };
  }
  return null;
}

export async function getLyrics(youtubeId: string, title: string, artist: string) {
  let lyrics = await getLyricsFromGenius(title, artist);
  if (!lyrics) {
    lyrics = await getLyricsFromYouTube(youtubeId);
  }
  return lyrics;
}