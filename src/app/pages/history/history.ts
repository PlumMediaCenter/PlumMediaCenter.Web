import { Component, OnInit } from '@angular/core';
import { Api } from '../../providers/api';
import { Alerter } from '../../providers/alerter';
import { AppSettings } from '../../providers/app-settings';
import { MediaItemHistoryRecord } from '../../interfaces/media-item-history-record';
import { Loader } from '../../providers/loader';

@Component({
    selector: 'page-history',
    templateUrl: 'history.html',
    styleUrls: ['history.scss']
})
export class HistoryPage implements OnInit {
    constructor(
        public api: Api,
        public appSettings: AppSettings,
        private alerter: Alerter,
        private loader: Loader
    ) {
    }
    public Math = Math;

    ngOnInit() {
        this.index = 0;
        this.posterFolderUrl = `${this.appSettings.apiUrl}/posters/`;
        this.size = 50;
        this.historyRecords = [];
        //load the first page of info
        this.loadMore();
    }

    private index: number;
    private size: number;
    public posterFolderUrl: string;
    public historyRecords: MediaItemHistoryRecord[];

    public async loadMore() {
        let more = await this.api.mediaItems.getAllHistory(this.size, this.index);
        //calculate some numbers for each item
        for (let i = 0; i < more.length; i++) {
            let record = more[i];
            (record as any).minutesWatched = Math.ceil(record.progressSecondsEnd / 60) - Math.floor(record.progressSecondsBegin / 60);
            (record as any).runtimeMinutes = Math.ceil(record.runtimeSeconds / 60);
            (record as any).progressMinutesBegin = Math.floor(record.progressSecondsBegin / 60);
            (record as any).progressMinutesEnd = Math.ceil(record.progressSecondsEnd / 60);
        }
        this.index += this.size;
        //append items to the end of the list
        this.historyRecords.push.apply(this.historyRecords, more);
    }

    public async deleteHistoryRecord(record: MediaItemHistoryRecord) {
        let hide = () => { };
        try {
            if (await this.alerter.confirm('Are you sure you want to delete this history record')) {
                hide = this.loader.show('Deleting history record');
                await this.api.mediaItems.deleteMediaHistoryRecord(record.id);
                //remove the item from the list
                this.historyRecords.splice(this.historyRecords.indexOf(record), 1);
            }
        } catch (e) {
            this.alerter.alert('There was an error deleting history record: ' + JSON.stringify(e));
        } finally {
            hide();
        }
    }
}
