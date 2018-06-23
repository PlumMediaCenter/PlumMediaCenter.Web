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
    failedItems: FailedItem[];
    exception: {
        message: string;
        stackTrace: string[];
    };
}

export interface MediaTypeCount {
    mediaType: MediaType;
    total: number;
    completed: number;
    remaining: number;
}

export interface FailedItem {
    id?: number;
    path: string;
    mediaType: MediaType;
    exception: {
        message: string;
        stackTrace: string[];
    };
}