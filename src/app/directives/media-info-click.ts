import { Directive, Input, HostListener } from '@angular/core';
import { MovieInfoPage } from '../pages/movie-info/movie-info';
import { Api } from '../providers/api';
import { Loader } from '../providers/loader';

@Directive({ selector: '[mediaInfoClick]' })
export class MediaInfoClickDirective {
    constructor(
        private api: Api,
        private loader: Loader
    ) {

    }

    @Input('mediaInfoClick')
    public mediaItemId: number;

    @HostListener('click')
    async click() {
        if (!this.mediaItemId) {
            throw new Error('mediaInfoClick: value cannot be null or undefined');
        }
        let hide = this.loader.show('Loading');
        try {
            let mediaItem = await this.api.mediaItems.getMediaItem(this.mediaItemId);

            switch (mediaItem.mediaType) {
                case 'MOVIE':
                    // TODO this.navCtrl.push(MovieInfoPage, { movieId: mediaItem.id });
                    break;
                default:
                    throw new Error('Not implemented');
            }
        } finally {
            hide();
        }
    }
}
