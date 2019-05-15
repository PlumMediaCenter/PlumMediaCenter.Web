import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

@Injectable()
export class Toaster {
    constructor(public toastCtrl: ToastController) {
    }

    async toast(message: string, options: ToastOptions = null) {
        options = Object.assign(<ToastOptions>{
            message: message,
            showCloseButton: true,
            duration: 3000
        }, options);
        let t = await this.toastCtrl.create(options);
        t.present();
    }
}
