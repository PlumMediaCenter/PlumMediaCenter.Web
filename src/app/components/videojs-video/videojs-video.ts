import { Component, Input, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';
import { AppSettings } from '../../providers/app-settings';
import { Api } from '../../providers/api';
import { Location } from '@angular/common';

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
        private location: Location,
        private api: Api
    ) {
        this.videoPlayerId = 'video_' + VideojsVideoComponent.indexCounter++;
        screen.orientation.lock('landscape');
    }
    /**
     * The html id for the video element
     */
    public videoPlayerId: string;

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
    public _seconds: number;

    private player;

    ngAfterViewInit() {
        let element = document.getElementById(this.videoPlayerId);
        this.player = videojs(element, {
            poster: this.poster,
            autoplay: this.autoplay,
            controls: false,
            fluid: false
        }, () => {
            //seek to the playback seconds specified
            if (this._seconds) {
                this.player.currentTime(this._seconds);
            }
            this.player.play();
            this.trackProgress();
            this.player.el_.appendChild(
                document.getElementById(`video-buttons-container-${this.videoPlayerId}`)
            );
            console.log('Player', this.player);
        });
        this.isPaused = this.player.paused();
        this.player.on(['pause', 'playing'], () => {
            this.isPaused = this.player.paused();
        });

        this.player.on('timeupdate', () => {
            this._seconds = this.player.currentTime();
        });

        this.player.on('useractive', () => {
            this.isUserActive = true;
        });
        this.player.on('userinactive', () => {
            this.isUserActive = false;
        });
        this.isUserActive = this.player.userActive();

        this.player.on('loadeddata', (...args) => {
            console.log('videodimensions', this.getVideoDimensions(document.getElementsByTagName('video')[0]));
            this.totalSeconds = Math.ceil(this.player.duration());
        });
    }

    /**
     * The total number of seconds duration of the current video
     */
    public totalSeconds = 0;

    /**
     * Is the user currently active? This is used to show/hide video controls
     */
    public isUserActive: boolean;

    public isPaused: boolean;

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

    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }
    jumpForward() {
        this.player.currentTime(this.player.currentTime() + this.appSettings.jumpForwardSeconds);
    }
    jumpBackward() {
        this.player.currentTime(this.player.currentTime() - this.appSettings.jumpBackwardSeconds);
    }

    toggleControlVisibility() {
        this.player.userActive(!this.isUserActive);
    }

    /**
     * Navigate backwards in history once.
     */
    public back() {
        this.location.back();
    }

    public getVideoDimensions(video) {
        // Ratio of the video's intrisic dimensions
        let videoRatio = video.videoWidth / video.videoHeight;
        // The width and height of the video element
        let width = video.offsetWidth;
        let height = video.offsetHeight;
        // The ratio of the element's width to its height
        let elementRatio = width / height;
        // If the video element is short and wide
        if (elementRatio > videoRatio) {
            width = height * videoRatio;
            // It must be tall and thin, or exactly equal to the original ratio
        } else {
            height = width / videoRatio;
        }
        return {
            width: width,
            height: height
        };
    }

    seekDragStart() {
        this.pause();
    }
    seekDragStop() {
        this.play();
    }

    seekChange(secondsFromSeekBar) {
        this.seconds = parseInt(secondsFromSeekBar);
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
