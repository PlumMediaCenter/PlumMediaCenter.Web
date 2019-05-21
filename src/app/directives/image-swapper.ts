import { Directive, Input, ElementRef, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { sleep } from '../util';


@Directive({ selector: '[imageSwapper]' })
export class ImageSwapperDirective implements OnDestroy, OnInit {

    constructor(
        private el: ElementRef,
        private viewContainerRef: ViewContainerRef
    ) {
        this.img = this.el.nativeElement;
    }

    private imageSwapInterval = 7000;
    private fadeOutMilliseconds = 1010;
    private intervalHandle;
    private img: HTMLImageElement;

    private currentIndex = -1;
    private async nextImage() {
        this.currentIndex++;
        if (this.currentIndex >= this.urls.length) {
            this.currentIndex = 0;
        }
        let url = this.urls[this.currentIndex];
        if (url) {
            //create a temporary absolutely positioned image element and fade it out
            const faderImage = document.createElement('img');
            //point to the "old" image and fade it out
            faderImage.src = this.img.src;
            Object.assign(faderImage.style, {
                width: this.img.offsetWidth,
                height: this.img.offsetHeight
            });
            faderImage.classList.add('fader-image');
            this.img.parentElement.appendChild(faderImage);
            await sleep(0);
            this.img.src = url;
            await sleep(0);
            faderImage.classList.add('transparent');
            await sleep(this.fadeOutMilliseconds);
            this.img.parentElement.removeChild(faderImage);
        }
    }

    ngOnInit(): void {
        this.intervalHandle = setInterval(async () => {
            //if this component is currently visible, swap to next image
            if (this.el.nativeElement.offsetParent) {
                console.log('next image');
                await this.nextImage();
            }
        }, this.imageSwapInterval);
        //run the first nextImage call so we get an image right away
        this.nextImage();
    }

    //stop the interval once this directive is destroyed
    ngOnDestroy(): void {
        clearInterval(this.intervalHandle);
    }


    @Input('imageSwapper')
    public set urls(value: string[]) {
        this._urls = value;
    }
    public get urls() {
        return this._urls ? this._urls : [];
    }
    private _urls: string[];
}
