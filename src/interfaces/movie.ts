import { MediaType } from "./media-type";

export interface Movie {
    id: number;
    mediaType: MediaType;
    title: string;
    sourceId: number;
    summary: string;
    description: string;
    duration: number;
    rating?: string;
    releaseDate?: Date;
    runtime: number;
    tmdbId?: number;
    posterUrl: string;
    backdropUrls: string[];
    videoUrl: string;
}

export interface CardMovie {
    id: number;
    posterUrl: string;
}


