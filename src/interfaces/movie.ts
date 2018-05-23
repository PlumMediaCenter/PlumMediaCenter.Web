export interface Movie {
    id: number;
    mediaType: 'MOVIE';
    title: string;
    summary: string;
    sourceId: number;
    description: string;
    runtimeSeconds: number;
    resumeSeconds: number;
    rating?: string;
    releaseDate?: Date;
    tmdbId?: number;
    posterUrl: string;
    backdropUrls: string[];
    videoUrl: string;
}

export interface CardMovie {
    id: number;
    posterUrl: string;
}


