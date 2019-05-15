export interface Movie {
  id: number;
  mediaType: 'MOVIE';
  title: string;
  sourceId: number;
  shortSummary: string;
  summary: string;
  runtimeSeconds: number;
  resumeSeconds: number;
  rating?: string;
  releaseYear?: number;
  tmdbId?: number;
  posterUrls: string[];
  backdropUrls: string[];
  videoUrl: string;
}

export interface CardMovie {
  id: number;
  posterUrls: string;
}


