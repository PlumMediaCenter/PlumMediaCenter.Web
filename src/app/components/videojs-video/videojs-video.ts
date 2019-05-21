import { Component, Input, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';
import { AppSettings } from '../../providers/app-settings';
import { Api } from '../../providers/api';

@Component({
    selector: 'videojs-video',
    templateUrl: 'videojs-video.html',
    styleUrls: [
        'videojs-video.scss',
        '../../../../node_modules/video.js/dist/video-js.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class VideojsVideoComponent implements AfterViewInit, OnDestroy {
    private static indexCounter = 1;
    constructor(
        private appSettings: AppSettings,
        private api: Api
    ) {
        this.id = 'video_' + VideojsVideoComponent.indexCounter++;
    }
    /**
     * The html id for the video element
     */
    public id: string;

    @Input()
    public mediaItemId: number;

    /**
     * The url to the video
     */
    @Input()
    public url: string;

    /**
     * A url to the video's poster or backdrop
     */
    @Input()
    public poster: string;

    @Input()
    public autoplay: string;

    @Input()
    public set seconds(value: number) {
        this._seconds = value;
        //make the player seek if it's ready. If it's not ready, it will do this itself on initialize
        if (this.player) {
            this.player.currentTime(this._seconds);
        }
    }
    private _seconds: number;

    private player;

    ngAfterViewInit() {
        let element = document.getElementById(this.id);
        this.player = videojs(element, {
            poster: this.poster,
            autoplay: this.autoplay,
            fluid: false
        }, () => {
            //seek to the playback seconds specified
            if (this._seconds) {
                this.player.currentTime(this._seconds);
            }
            this.player.play();
            this.trackProgress();
        });
    }

    private progressIntervalHandler: any;
    private trackProgress() {
        //stop any previous interval
        this.stopTrackProgress();
        //create a new interval handler
        let previousTime: number;
        this.progressIntervalHandler = async () => {
            //quit if the interval was canceled
            if (!this.progressIntervalHandler) {
                return;
            }
            let currentTime: number = this.player.currentTime();
            //only update the progress if the progress has changed
            if (currentTime !== previousTime) {
                previousTime = currentTime;
                try {
                    let progressSeconds = Math.floor(this.player.currentTime());
                    //save the progress of this video
                    await this.api.mediaItems.setProgress(this.mediaItemId, progressSeconds);
                } catch (e) {
                    //do nothing with server errors...nothing we can do about it
                }
            }
        };

        setInterval(this.progressIntervalHandler, this.appSettings.saveMediaProgressInterval);
    }

    stopTrackProgress() {
        if (this.progressIntervalHandler) {
            clearInterval(this.progressIntervalHandler);
        }
        this.progressIntervalHandler = undefined;
    }

    ngOnDestroy() {
        //destroy the video player if it was created
        if (this.player) {
            this.player.dispose();
        }
        //stop updating the server with the media progress
        this.stopTrackProgress();
    }
}
