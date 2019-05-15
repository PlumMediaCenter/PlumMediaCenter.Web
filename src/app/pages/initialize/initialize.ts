import { Component } from '@angular/core';
import { Api } from '../../providers/api';
import { Loader } from '../../providers/loader';
import { Alerter } from '../../providers/alerter';
import { InstallDatabasePage } from '../install-database/install-database';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-initialize',
    templateUrl: 'initialize.html'
})
export class InitializePage {

    constructor(
        public api: Api,
        public loader: Loader,
        public alerter: Alerter
    ) {
        this.init();
    }
    public rootUsername: string;
    public rootPassword: string;

    public async init() {
        let stop = this.loader.showForMinimum('Initializing PlumMediaCenter');
        let isInstalled = await this.api.database.getIsInstalled();
        await stop();
        if (!isInstalled) {
            // TODO this.navCtrl.setRoot(InstallDatabasePage);
        } else {
            // TODO this.navCtrl.setRoot(HomePage);
        }
    }

}
