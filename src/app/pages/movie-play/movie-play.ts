import { Component, OnInit, DoCheck, ElementRef } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Api } from '../../providers/api';
import { Movie } from '../../interfaces/movie';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'page-movie-play',
    templateUrl: 'movie-play.html',
    styleUrls: ['movie-play.scss']
})
export class MoviePlayPage implements OnInit, DoCheck {

    constructor(
        public api: Api,
        public activatedRoute: ActivatedRoute,
        private el: ElementRef,
        private location: Location,
        private router: Router
    ) {
        //anytime the router changes, determine if we should show the video player. This is the best way I could
        //figure out how to stop playback when clicking the back button
        router.events.subscribe(evt => {
            this.ngDoCheck();
        });
    }

    public isVideoVisible = true;

    ngDoCheck() {
        this.isVideoVisible = !!this.el.nativeElement.offsetParent;
    }

    /**
     * The seconds the video should resume playback at
     */
    public get resumeSeconds() {
        const fromQuery = this.activatedRoute.snapshot.queryParams.resumeSeconds;
        if (fromQuery !== null && fromQuery !== undefined) {
            return fromQuery;
        } else {
            return this.movie.resumeSeconds;
        }
    }

    private get movieId() {
        return this.activatedRoute.snapshot.params.id;
    }

    public movie: Movie;
    async ngOnInit() {
        this.movie = await this.api.movies.getById(this.movieId);
    }

    public back() {
        this.location.back();
    }
}
