import { Http2, Http2Factory } from './http2-factory';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { Movie, CardMovie } from '../interfaces/movie';
import { MovieMetadataComparison, MovieMetadata } from '../interfaces/movie-metadata-comparison';
import { MovieMetadataSearchResult } from '../interfaces/movie-metadata-search-result';
import { LibraryGenerationStatus } from '../interfaces/library-generation-status';
import { Source } from '../interfaces/source';
import { MediaProgress } from '../interfaces/media-progress';
import { MediaItemHistoryRecord } from '../interfaces/media-item-history-record';

@Injectable()
export class Api {
    constructor(
        http2Factory: Http2Factory,
        appSettings: AppSettings
    ) {
        this.http2 = http2Factory.create(appSettings.apiUrl);
    }
    private http2: Http2;

    public movies = {
        getAll: async () => {
            return await this.http2.graphqlRequest<CardMovie[]>(`{
                movies{
                    id
                    posterUrl
                }
            }`, null, 'GET', 'movies');
        },
        getById: async (id: number) => {
            return await this.http2.graphqlRequest<Movie>(`
                query GetMovieById($id: Int) {
                    movies(ids: [$id]) {
                        id
                        mediaType
                        title
                        sourceId
                        summary
                        description
                        runtimeSeconds
                        rating
                        releaseDate
                        tmdbId
                        posterUrl
                        backdropUrls
                        videoUrl
                    }
                }
            `, { id }, 'GET', 'movies.0');
        }
    };

    public metadata = {
        _movieMetadataFields: `
            backdropUrls
            collection
            collectionOrder
            completionSeconds
            description
            extraSearchText
            genres
            keywords
            posterUrls
            rating
            releaseDate
            runtimeSeconds
            sortTitle
            summary
            title
            tmdbId
        `,
        compareMovie: async (movieId: number, tmdbId: number) => {
            return await this.http2.graphqlRequest<MovieMetadataComparison>(`
                query getMovieMetadataComparison($movieId:Int!, $tmdbId: Int!) {
                    movieMetadataComparison(movieId: $movieId, tmdbId: $tmdbId){
                        incoming {
                            ${this.metadata._movieMetadataFields}
                        }
                        current {
                            ${this.metadata._movieMetadataFields}
                        }
                    }
                }
            `, { movieId, tmdbId }, 'GET', 'movieMetadataComparison');
        },
        /**
         * Get a list of search results from tmdb
         */
        getMovieSearchResults: async (searchText: string) => {
            return await this.http2.graphqlRequest<MovieMetadataSearchResult[]>(`
                query GetMovieMetadataSearchResults($searchText: String!) {
                    movieMetadataSearchResults(searchText: $searchText) {
                        title
                        posterUrl
                        tmdbId
                        overview
                        releaseDate
                    }
                }
            `, { searchText }, 'GET', 'movieMetadataSearchResults');
        },
        /**
         * Save the movie metadata. This will completely replace all metadata items for this movie on disk
         */
        save: async (movieId: number, metadata: MovieMetadata) => {
            return await this.http2.post(`api/metadata/movies/${movieId}`, metadata);
        }
    }

    public mediaItems = {
        /**
         * Get history records for all media items
         */
        getAllHistory: async (limit?: number, index?: number) => {
            return await this.http2.get<MediaItemHistoryRecord[]>('api/mediaItems/history', { index, limit });
        },
        /**
         * Get history records for a single media item.
         */
        getHistory: async (mediaItemId: number, limit?: number, index?: number) => {
            return await this.http2.get<MediaItemHistoryRecord[]>(`api/mediaItems/${mediaItemId}/history`);
        },

        /**
         * Delete a history record by its id
         */
        deleteHistoryById: async (id: number) => {
            return await this.http2.delete(`api/mediaItems/history/${id}`);
        },
        /**
         * Set the current progress of a media item (i.e. the number of seconds into the item the user is)
         */
        setProgress: async (mediaItemId: number, seconds: number) => {
            return await this.http2.post<MediaProgress>(`api/mediaItems/${mediaItemId}/progress`, { seconds });
        },
        /**
         * Get the latest history record for the media item
         */
        getProgress: async (mediaItemId: number) => {
            return this.mediaItems.getHistory(mediaItemId, 1);
        },
        /**
         * Get a media item by its id. Call this when you don't know what type of media id you have (movie, episode, etc...)
         */
        getMediaItem: async (mediaItemId: number) => {
            return await this.http2.get<Movie>(`api/mediaItems/${mediaItemId}`);
        },
        /**
         * Get the number of seconds that the item should resume at. Usually this is because the user stopped the mediaItem sometime before finishing it.
         * Example: user stops movie, goes to bed. Starts to watch movie again in the morning. This method would let the player know the second
         * to resume at.
         */
        getResumeSeconds: async (mediaItemId: number) => {
            return await this.http2.get<number>(`api/mediaItems/${mediaItemId}/resumeSeconds`);
        },
        /**
         * Get a list of search results based on a search string
         */
        getSearchResults: async (searchText: string) => {
            return await this.http2.get<any[]>(`api/mediaItems`, { q: searchText });
        }
    }

    public library = {
        _fields: `  
            state
            isProcessing
            lastGeneratedDate
            countTotal
            countCompleted
            countRemaining
            secondsRemaining
            activeFiles
            mediaTypeCounts {
                mediaType
                total
                completed
                remaining
            }
        `,
        /**
         * Start the library generation process. The return 
         */
        generate: async () => {
            return await this.http2.graphqlRequest<LibraryGenerationStatus>(`
                mutation GenerateLibrary {
                    libraryGeneratorStatus: generateLibrary {
                        ${this.library._fields}
                    }
                }
            `, null, 'GET', 'libraryGeneratorStatus');
        },
        getStatus: async () => {
            return await this.http2.graphqlRequest<LibraryGenerationStatus>(`
            {
                libraryGeneratorStatus {
                  ${this.library._fields}
                }
            }`, null, 'GET', 'libraryGeneratorStatus');
        },
        /**
         * Process items by their ids. This can be any media type
         */
        processItems: async (ids: number[]) => {
            return await this.http2.graphqlRequest<LibraryGenerationStatus>(`
                mutation ProcessItems($ids: [Int]!) {
                    processItems(ids: $ids)
                }
        `, { ids }, 'GET', 'processItems');
        }
    }

    public sources = {
        getAll: async () => {
            return await this.http2.graphqlRequest<Source[]>(`
                query GetAllSources {
                    sources {
                        id
                        mediaType
                        folderPath
                    }
                }
            `, null, 'GET', 'sources');
        },

        /**
         * Save this list as the full list of sources
         */
        setAll: async (sources: Source[]) => {
            return await this.http2.graphqlRequest(`
                mutation SetAllSources($sources: [SourceInput]!){
                    sources: setAllSources(sources: $sources){
                        id
                        mediaType
                        folderPath
                    }
                }
            `, { sources }, 'PUT', 'sources');
        }
    }

    public database = {
        /**
         * Determine if the database is installed on the server
         */
        getIsInstalled: async () => {
            return await this.http2.get<boolean>('api/database/isInstalled');
        },
        /**
         * Install the pmc database
         */
        install: async (rootUsername: string, rootPassword: string) => {
            return await this.http2.post('api/database/install', { rootUsername, rootPassword });
        }
    }
}