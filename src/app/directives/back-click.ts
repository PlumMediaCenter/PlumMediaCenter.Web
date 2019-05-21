import { Directive, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
    selector: '[backClick]'
})
export class BackClickDirective implements OnInit, OnDestroy {

    constructor(
        public location: Location,
        private viewContainer: ViewContainerRef
    ) {

    }

    private onClick = () => {
        this.location.back();
    }

    ngOnInit() {
        const el = this.viewContainer.element.nativeElement as HTMLElement;
        el.addEventListener('click', this.onClick);
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.onClick);
    }

}
