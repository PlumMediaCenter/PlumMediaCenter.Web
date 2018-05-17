import { MediaType } from "../interfaces/media-type";

export interface MediaItemHistoryRecord {
    mediaType: MediaType;
    posterUrl: string;
    title: string;
    runtimeSeconds: number;
    progressSecondsBegin: number;
    progressSecondsEnd: number;
    totalProgressSeconds: number;
    id: number;
    profileId: number;
    mediaItemId: number;
    dateBegin: string;
    dateEnd: string;
}

