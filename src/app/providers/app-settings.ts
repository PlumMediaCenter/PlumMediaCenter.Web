import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettings {
    constructor() {
    }
    /**
     * The full url to the letsvote api
     */
    public get apiUrl() {
        return this.getValue('apiUrl');
    }

    /**
     * The full url to the root of the web application
     */
    public get appUrl() {
        return this.getValue('appUrl');
    }

    public getValue(key: string) {
        if (window[key]) {
            return window[key];
        } else {
            return environment[key];
        }
    }

    /**
     * The minimum number of milliseconds to display the loading message during sign in and sign out
     */
    public minLoadDuration = 200;
    /**
     * For debugging purposes only, includes the token in the querystring for all requests
     */
    public includeTokenInQuerystring = false;

    // public static googleClientApiKey = 'com.googleusercontent.apps.470698204130-t7jk4m1226k8k931kkta3eq4pqs3egts';
    public static googleClientApiKey = '470698204130-t7jk4m1226k8k931kkta3eq4pqs3egts.apps.googleusercontent.com';

    public saveMediaProgressInterval = 2000;

}
