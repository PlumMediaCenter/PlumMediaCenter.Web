import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { Movie } from '../interfaces/movie';
import { NavController } from 'ionic-angular';
import { MoviePlayPage } from '../pages/movie-play/movie-play';

@Directive({ selector: '[moviePlayClick]' })
export class MoviePlayClick {
    constructor(el: ElementRef, public navCtrl: NavController) {

    }

    private movie: Movie;
    private movieId: number;

    @Input("moviePlayClick")
    public set movieOrId(value: any) {
        if (typeof value === 'object') {
            this.movie = value;
        } else {
            this.movieId = value;
        }
    };

    @HostListener("click")
    click() {
        if (!this.movie && !this.movieId) {
            throw new Error("movieMetadataClick: value cannot be null or undefined");
        }
        this.navCtrl.push(MoviePlayPage, { movie: this.movie, movieId: this.movieId })
    }
}