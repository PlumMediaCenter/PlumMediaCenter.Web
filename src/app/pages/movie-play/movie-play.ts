import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Api } from '../../providers/api';
import { Movie } from '../../interfaces/movie';

@Component({
    selector: 'page-movie-play',
    templateUrl: 'movie-play.html',
    styleUrls: ['movie-play.scss']
})
export class MoviePlayPage implements OnInit {

    constructor(
        public navParams: NavParams,
        public api: Api
    ) {

    }
    public movie: Movie;
    async ngOnInit() {
        this.movie = this.navParams.data.movie;
        //if the movie doesn't have what we need, fetch it.
        if (!this.movie || this.movie.resumeSeconds === undefined) {
            this.movie = await this.api.movies.getById(this.navParams.data.movieId);
        }
    }
}
