import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../providers/api';
import { CardMovie } from '../../interfaces/movie';
import { SourcesPage } from '../sources/sources';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController,
        public api: Api
    ) {

    }
    async ionViewDidLoad() {
        this.movies = await this.api.movies.getAll();
    }
    public movies: CardMovie[];

    navigateToAddMediaSource() {
        this.navCtrl.push(SourcesPage);
    }

}
