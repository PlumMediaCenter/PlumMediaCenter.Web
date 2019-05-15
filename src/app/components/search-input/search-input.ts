import { Component, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SearchResultsPage } from '../../pages/search-results/search-results';

@Component({
    selector: 'search-input',
    templateUrl: 'search-input.html'
})
export class SearchInputComponent {

    constructor(
        public menuCtrl: MenuController
    ) {
    }
    public searchText: string;

    public search() {
        // TODO
        // //if we are already on the search page, scrap the previous search page in favor of this new one
        // if (this.nav.getActive().component instanceof SearchResultsPage) {
        //     this.nav.pop();
        // }
        // this.nav.push(SearchResultsPage, { searchText: this.searchText });
        // this.searchText = '';
        // this.menuCtrl.close();
    }
}
