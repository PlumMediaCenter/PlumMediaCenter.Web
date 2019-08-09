import { Component } from '@angular/core';
import { Api } from '../../providers/api';
import { Loader } from '../../providers/loader';
import { Alerter } from '../../providers/alerter';
import { HomePage } from '../home/home';
import { Toaster } from '../../providers/toaster';
import { Router } from '@angular/router';

@Component({
    selector: 'page-setup',
    templateUrl: 'setup.html',
    styleUrls: ['setup.scss']
})
export class SetupPage {

    constructor(
        public api: Api,
        public loader: Loader,
        public alerter: Alerter,
        public toaster: Toaster,
        private router: Router
    ) {

    }
    public rootUsername: string;
    public rootPassword: string;

    public async install() {
        let stop = this.loader.showForMinimum('Installing database');
        try {
            await this.api.database.install(this.rootUsername, this.rootPassword);
            await stop();
            this.router.navigateByUrl('/home');
            this.toaster.toast('Database successfully installed');
        } catch (e) {
            if (e) {
                this.alerter.alert('An error occured: ' + JSON.stringify(e));
            }
            await stop();
        }
    }

}
