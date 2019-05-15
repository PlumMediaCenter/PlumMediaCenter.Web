import { Component } from '@angular/core';
import { Api } from '../../providers/api';
import { Alerter } from '../../providers/alerter';
import { Loader } from '../../providers/loader';
import { Toaster } from '../../providers/toaster';
import { AdminPage } from '../admin/admin';
import { MediaType } from '../../interfaces/media-type';
import { Source } from '../../interfaces/source';

@Component({
    selector: 'page-sources',
    templateUrl: 'sources.html'
})
export class SourcesPage {

    constructor(
        public api: Api,
        public alerter: Alerter,
        public loader: Loader,
        public toaster: Toaster
    ) {
        this.init();
    }
    private async init() {
        this.sources = await this.api.sources.getAll();
    }

    public mediaTypes: { title: string, value: MediaType }[] = [{
        title: 'Movies',
        value: 'MOVIE'
    }, {
        title: 'Tv Shows',
        value: 'TV_SHOW'
    }];

    public sources: Source[];

    public async save() {
        let hideSave = () => { }, hideLibgen = () => { };
        try {
            hideSave = this.loader.showForMinimum('Saving sources');
            await this.api.sources.setAll(this.sources);
            await hideSave();
            let libgenPromise = this.api.library.generate();

            await this.alerter.alert('Video sources have been changed. The library must now be regenerated?');
            hideLibgen = this.loader.showForMinimum('Launching library generator');
            await libgenPromise;
            await hideLibgen();
            //go back to the previous page
            //TODO this.navCtrl.setRoot(AdminPage);
        } catch (e) {
            await hideSave();
            await hideLibgen();
            this.alerter.alert('There was an error saving sources: ' + e.message);
        }

    }


}
