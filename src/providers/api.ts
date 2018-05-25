import { Http2, Http2Factory } from './http2-factory';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { Movie, CardMovie } from '../interfaces/movie';
import { MovieMetadataComparison, MovieMetadata } from '../interfaces/movie-metadata-comparison';
import { MovieMetadataSearchResult } from '../interfaces/movie-metadata-search-result';
import { LibraryGenerationStatus } from '../interfaces/library-generation-status';
import { Source } from '../interfaces/source';
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
            return await this.http2.graphqlRequest<CardMovie[]>(`
            {
                movies {
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
                        summary
                        sourceId
                        description
                        runtimeSeconds
                        resumeSeconds
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
            return this.http2.graphqlRequest(`
                mutation ($movieId: Int!, $metadata: MovieMetadataInput!) {
                    saveMovieMetadata(movieId: $movieId, metadata: $metadata)
                }
            `, { movieId, metadata }, 'POST');
        }
    }

    public mediaItems = {
        /**
         * Get history records for all media items
         */
        getAllHistory: async (limit?: number, index?: number) => {
            return this.http2.graphqlRequest<MediaItemHistoryRecord[]>(`
                query GetMediaHistory {
                    mediaHistory {
                        mediaType
                        posterUrl
                        title
                        runtimeSeconds
                        progressSecondsBegin
                        progressSecondsEnd
                        totalProgressSeconds
                        id
                        profileId
                        mediaItemId
                        dateBegin
                        dateEnd
                    }
                }
            `, { /*index, limit*/ }, 'GET', 'mediaHistory');
        },
        /**
         * Delete a history record by its id
         */
        deleteMediaHistoryRecord: async (id: number) => {
            return await this.http2.graphqlRequest(`
                mutation ($id: Int!) {
                    deleteMediaHistoryRecord(id: $id)
                }
            `, { id }, 'DELETE');
        },
        /**
         * Set the current progress of a media item (i.e. the number of seconds into the item the user is)
         */
        setProgress: async (mediaItemId: number, seconds: number) => {
            return this.http2.graphqlRequest(`
                mutation ($mediaItemId: Int!, $seconds: Int!){
                    setMediaItemProgress(mediaItemId: $mediaItemId, seconds: $seconds)
                }
            `, { mediaItemId, seconds }, 'POST');
        },
        /**
         * Get a media item by its id. Call this when you don't know what type of media id you have (movie, episode, etc...)
         */
        getMediaItem: async (mediaItemId: number) => {
            return await this.http2.graphqlRequest<Movie>(`
                query GetMediaItem($mediaItemIds: [Int]!){
                    mediaItems(mediaItemIds: $mediaItemIds){
                        ...on Movie{
                            id
                            mediaType
                        }
                    }
                }
            `, { mediaItemIds: [mediaItemId] }, 'GET', 'mediaItems.0')
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
            error {
                message
                stackTrace
            }
        `,
        /**
         * Start the library generation process. The return 
         */
        generate: async () => {
            return await this.http2.graphqlRequest<LibraryGenerationStatus>(`
                mutation {
                    generateLibrary {
                        ${this.library._fields}
                    }
                }
            `, null, 'GET', 'generateLibrary');
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
                mutation ($ids: [Int]!) {
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
                mutation ($sources: [SourceInput]!){
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
            return await this.http2.graphqlRequest<any>(`
                query {
                    database {
                        isInstalled
                    }
                }
            `, undefined, undefined, 'database.isInstalled');
        },
        /**
         * Install the pmc database
         */
        install: async (rootUsername: string, rootPassword: string) => {
            return await this.http2.graphqlRequest(`
                mutation ($rootUsername: String!, $rootPassword: String!){
                    installDatabase(rootUsername: $rootUsername, rootPassword: $rootPassword)
                }
            `, { rootUsername, rootPassword }, 'POST');
        }
    }
}