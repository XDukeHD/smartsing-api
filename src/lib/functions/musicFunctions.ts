import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import { getLyrics } from 'genius-lyrics-api';
import { YoutubeTranscript } from 'youtube-transcript';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function searchSpotify(query: string) {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    const result = await spotifyApi.searchTracks(query, { limit: 1 });
    if (result.body.tracks?.items.length) {
      const track = result.body.tracks.items[0];
      return {
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        releaseDate: track.album.release_date,
        albumImage: track.album.images[0]?.url,
        spotifyId: track.id,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

export async function searchYouTube(query: string) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 1,
      },
    });
    if (response.data.items.length) {
      const video = response.data.items[0];
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.default.url,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

export async function getLyricsFromGenius(title: string, artist: string) {
  try {
    const options = {
      apiKey: process.env.GENIUS_ACCESS_TOKEN,
      title,
      artist,
      optimizeQuery: true,
    };
    const lyrics = await getLyrics(options);
    return lyrics;
  } catch (error) {
    console.error(error);
  }
  return null;
}

export async function getLyricsFromYouTube(videoId: string) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' ');
  } catch (error) {
    console.error(error);
  }
  return null;
}