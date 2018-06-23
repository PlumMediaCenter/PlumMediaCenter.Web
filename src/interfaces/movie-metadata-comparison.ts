export interface MovieMetadataComparison {
    incoming: MovieMetadata;
    current: MovieMetadata;
}
export interface MovieMetadata {
    backdropUrls: any[];
    collection?: any;
    collectionOrder?: any;
    completionSeconds: number;
    description: string;
    extraSearchText: string[];
    genres: string[];
    keywords: string[];
    posterUrls: any[];
    rating: string;
    releaseYear: number;
    runtimeSeconds: number;
    sortTitle: string;
    summary: string;
    title: string;
    tmdbId: number;
    cast: Cast[];
    crew: Crew[];
}

export interface Cast {
    tmdbId: number;
    character: string;
    name: string;
}

export interface Crew {
    tmdbId: number;
    job: string;
    name: string;
}
