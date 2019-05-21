import { Component} from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { InitializePage } from './pages/initialize/initialize';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private menu: MenuController
    ) {
        this.initializeApp();
    }

    rootPage: any = InitializePage;

    pages: Array<{ title: string, url: string }>;

    async initializeApp() {
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', url: '/home' },
            { title: 'Admin', url: '/admin' },
            { title: 'Account', url: '/account' }
        ];
        await this.platform.ready();
        this.statusBar.styleDefault();
        this.splashScreen.hide();
    }

    async search(text) {
        console.log(text);
    }

    async hideMenu() {
        this.menu.close();

    }
}
