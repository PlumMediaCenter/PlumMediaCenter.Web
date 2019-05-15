import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Api } from '../../providers/api';
import { Loader } from '../../providers/loader';
import { Alerter } from '../../providers/alerter';

@Component({
    selector: 'page-search-results',
    templateUrl: 'search-results.html',
    styleUrls: ['search-results.scss']
})
export class SearchResultsPage implements OnInit {
    constructor(
        public api: Api,
        public navParams: NavParams,
        public loader: Loader,
        public alerter: Alerter
    ) {

    }

    public get searchText() {
        return this.navParams.data.searchText;
    }

    async ngOnInit() {
        let hide = this.loader.show('Loading search results');
        try {
            this.searchResults = await this.api.mediaItems.getSearchResults(this.searchText);
        } catch (e) {
            this.alerter.alert('Error loading search results: ' + JSON.stringify(e));
        } finally {
            hide();
        }
    }

    public searchResults: any[];
}
