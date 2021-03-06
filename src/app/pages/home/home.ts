import { Component, OnInit } from '@angular/core';
import { Api } from '../../providers/api';
import { CardMovie } from '../../interfaces/movie';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    constructor(
        public api: Api
    ) {

    }
    async ngOnInit() {
        this.movies = await this.api.movies.getAll();
    }
    public movies: CardMovie[];
}
