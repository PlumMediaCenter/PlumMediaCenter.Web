import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { SourcesPage } from '../pages/sources/sources';
import { HistoryPage } from '../pages/history/history';

@Directive({ selector: '[goToPageClick]' })
export class GoToPageClickDirective {
    constructor(
        el: ElementRef
    ) {

    }

    private pages = {
        'Sources': SourcesPage,
        'History': HistoryPage
    };

    @Input('goToPageClick')
    public set pageNameAttr(value: string) {
        this.pageName = value;
    }
    private pageName: string;


    @HostListener('click')
    click() {
        let page = this.pages[this.pageName];
        //TODO this.navCtrl.push(page, {});
    }
}
