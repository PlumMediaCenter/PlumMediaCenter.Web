import { Directive, Input, ElementRef, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NavController } from 'ionic-angular';

@Directive({ selector: '[imageSwapper]' })
export class ImageSwapperDirective implements OnDestroy, OnInit {

    constructor(
        private el: ElementRef,
        private viewContainerRef: ViewContainerRef,
        private navCtrl: NavController
    ) {
        this.img = this.el.nativeElement;
    }
    private intervalHandle;
    private img: HTMLImageElement;

    /**
     * Determine if the parent view is currently visible
     */
    private get parentViewIsVisible() {
        var parentComponent = (this.viewContainerRef as any)._view.component;
        var activeComponent = this.navCtrl.getActive().instance;
        if (parentComponent === activeComponent) {
            return true;
        } else {
            return false;
        }
    }

    private currentIndex = -1;
    private nextImage() {
        this.currentIndex++;
        if (this.currentIndex >= this.urls.length) {
            this.currentIndex = 0;
        }
        var url = this.urls[this.currentIndex];
        if (url) {
            this.img.src = url;
        }
    }

    ngOnInit(): void {
        this.intervalHandle = setInterval(() => {
            if (this.parentViewIsVisible) {
                this.nextImage();
            }
        }, 5000);
        //run the first nextImage call so we get an image right away
        this.nextImage();
    }

    //stop the interval once this directive is destroyed
    ngOnDestroy(): void {
        clearInterval(this.intervalHandle);
    }


    @Input("imageSwapper")
    public set urls(value: string[]) {
        this._urls = value;
    }
    public get urls() {
        return this._urls ? this._urls : [];
    }
    private _urls: string[];
}