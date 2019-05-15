import { Directive, Input, HostListener } from '@angular/core';
import { Api } from '../providers/api';
import { Loader } from '../providers/loader';

import { Toaster } from '../providers/toaster';

@Directive({ selector: '[mediaItemProcessClick]' })
export class MediaItemProcessClickDirective {
    constructor(
        private api: Api,
        private toaster: Toaster,
        private loader: Loader
    ) {

    }

    private _mediaId: number;

    @Input('mediaItemProcessClick')
    public set mediaItemId(value: number | { id: number }) {
        if (typeof value === 'object') {
            this._mediaId = value.id;
        } else {
            this._mediaId = value;
        }
    }

    @HostListener('click')
    async click() {
        if (!this._mediaId) {
            throw new Error('mediaItemProcessClick: value cannot be null or undefined');
        }
        let hide = this.loader.show('Processing item');
        try {
            await this.api.library.processItems([this._mediaId]);
            this.toaster.toast('Processing finished');
        } catch (e) {
            this.toaster.toast('There was an error processing item: ' + (e as Error).message);
        } finally {
            hide();
        }
        //try to refresh the current view
        // TODO let component = this.navCtrl.getActive().instance;
        //re-run the view load function if the page has one
        // if (component.ngOnInit) {
        //     component.ngOnInit();
        // }
    }
}
