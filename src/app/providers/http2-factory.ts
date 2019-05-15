import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class Http2Factory {
    constructor(
        private httpClient: HttpClient
    ) {

    }
    public create(url: string) {
        return new Http2(this.httpClient, url);
    }
}

export class Http2 {
    private rootUrl: string;
    constructor(
        private httpClient: HttpClient,
        rootUrl: string = null
    ) {
        if (rootUrl.lastIndexOf('/') !== rootUrl.length - 1) {
            rootUrl = rootUrl + '/';
        }
        this.rootUrl = rootUrl;
    }

    /**
     * Perform any request type
     */
    public request<T>(url: string, config: Http2RequestConfig): Promise<T> {
        if (config.body) {
            config.body = JSON.stringify(config.body);
        }
        config = Object.assign({
            params: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }, config);

        //TODO implement auth
        // let token = this.tokenStorage.getToken();
        // if (token) {
        //     config.headers = Object.assign({}, config.headers, {
        //         'X-Auth-Token': token
        //     });

        //     //Include the token as a querystring parameter. This is only for debugging purposes
        //     if (this.appSettings.includeTokenInQuerystring) {
        //         config.params.AuthToken = token;
        //     }
        // }

        url = this.rootUrl ? this.rootUrl + url : url;
        //remove any trailing slash from the url
        if (url.lastIndexOf('/') === url.length - 1) {
            url = url.substring(0, url.length - 1);
        }

        return this.httpClient.request<T>(config.method, url, config).toPromise().then((result) => {
            return result;
        }, (errorResponse) => {
            return Promise.reject(errorResponse.error);
        });
    }

    /**
     * Perform a GET graphql query
     * @param query
     * @param variables
     * @param method
     * @param dataPath retrieves the data at the specified named path. For example 'polls.0.serie.id' would get the serieId for the first poll in the result
     */
    public async graphqlRequest<T = any>(query: string, variables: any = {}, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', dataPath: string = null) {
        let type = query.trim().substring(0, 8).toLowerCase().indexOf('query') === 0 ? 'query' : 'mutation';
        if (!method) {
            method = 'GET';
        }
        let queryName = this.getQueryOrMutationName(query);
        if (!queryName) {
            queryName = `UNNAMED_${type.toUpperCase()}`;
        }
        //remove any excess whitespace from the query only for GET requests since this is passed on the URL
        if (method === 'GET') {
            query = this.graphqlTrim(query);
        }
        let response: { data: any };
        try {
            response = await this.request<{ data: any }>(`graphql?${queryName}`, {
                method,
                params: method === 'GET' ? {
                    query,
                    variables: JSON.stringify(variables)
                } : undefined,
                body: method !== 'GET' ? {
                    query,
                    variables: variables
                } : undefined
            });
        } catch (e) {
            if (!e.message && e.errors && e.errors[0]) {
                e.message = e.errors[0].message;
            }
            throw e;
        }
        if (!dataPath) {
            return <T>response.data;
        } else {
            let parts = dataPath.split('.');
            let result = response.data;
            for (let part of parts) {
                result = result[part];
            }
            return <T>result;
        }
    }

    private getQueryOrMutationName(query: string) {
        let regexp = /\s*(?:query|mutation)?\s*(\w*)?[\s\(\w\:|!\\$\[\]),]*\{\s*(\w*)/gi;
        let match = regexp.exec(query);
        if (match) {
            //keep the first match, or the second match, or null if no matches were found to be not null
            return match[1] || match[2] || null;
        } else {
            return null;
        }
    }
    private graphqlTrim(text: string) {
        text = text.replace(/\s+/g, ' ');
        return text;
    }

    public get<T>(url: string, params?: any, config?: any): Promise<T> {
        let cfg = Object.assign({}, config, {
            method: 'GET',
            params
        });

        return this.request<T>(url, cfg);
    }

    public post<T>(url: string, body?: any, config?: any): Promise<T> {
        let cfg = Object.assign({}, config, {
            method: 'POST',
            body
        });
        return this.request<T>(url, cfg);
    }

    public put<T>(url: string, body?: any, config?: any): Promise<T> {
        let cfg = Object.assign({}, config, {
            method: 'PUT',
            body
        });

        return this.request<T>(url, cfg);
    }

    public delete<T>(url: string, body?: any, config?: any): Promise<T> {
        let cfg = Object.assign({}, config, {
            method: 'DELETE',
            body
        });
        return this.request<T>(url, cfg);
    }
}

export interface Http2RequestConfig {
    params?: { [key: string]: any };
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: { [key: string]: any };
    body?: any;
}
