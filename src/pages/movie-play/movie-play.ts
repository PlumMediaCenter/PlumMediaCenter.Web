import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';
import { Movie } from '../../interfaces/movie';

@Component({
    selector: 'page-movie-play',
    templateUrl: 'movie-play.html'
})
export class MoviePlayPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: Api
    ) {

    }
    public movie: Movie;
    async ionViewDidLoad() {
        this.movie = this.navParams.data.movie;
        //if the movie doesn't have what we need, fetch it.
        if (!this.movie || this.movie.resumeSeconds === undefined) {
            this.movie = await this.api.movies.getById(this.navParams.data.movieId);
        }
    }
}
