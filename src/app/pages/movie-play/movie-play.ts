import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Api } from '../../providers/api';
import { Movie } from '../../interfaces/movie';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-movie-play',
    templateUrl: 'movie-play.html',
    styleUrls: ['movie-play.scss']
})
export class MoviePlayPage implements OnInit {

    constructor(
        public api: Api,
        public activatedRoute: ActivatedRoute
    ) {

    }

    private get movieId() {
        return this.activatedRoute.snapshot.params.id;
    }

    public movie: Movie;
    async ngOnInit() {
        this.movie = await this.api.movies.getById(this.movieId);
    }
}
