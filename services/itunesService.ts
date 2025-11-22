import { ITunesResponse, Song } from '../types';

export const searchMusic = async (term: string): Promise<Song[]> => {
  if (!term.trim()) return [];
  
  try {
    // iTunes API endpoint
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=8`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data: ITunesResponse = await response.json();
    
    // Enhance artwork quality by replacing 100x100 with 600x600 in the URL
    const highQualityResults = data.results.map(song => ({
      ...song,
      artworkUrl100: song.artworkUrl100.replace('100x100bb', '600x600bb')
    }));

    return highQualityResults;
  } catch (error) {
    console.error("Error fetching music:", error);
    return [];
  }
};
