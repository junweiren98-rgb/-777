export interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  collectionName: string;
}

export interface ITunesResponse {
  resultCount: number;
  results: Song[];
}
