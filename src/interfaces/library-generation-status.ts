import { MediaType } from "./media-type";

export interface LibraryGenerationStatus {
    state: string;
    isProcessing: boolean;
    lastGeneratedDate: Date;
    countTotal: number;
    countCompleted: number;
    countRemaining: number;
    secondsRemaining: number;
    activeFiles: string[];
    mediaTypeCounts: MediaTypeCount[];
}

export interface MediaTypeCount {
    mediaType: MediaType;
    total: number;
    completed: number;
    remaining: number;
}