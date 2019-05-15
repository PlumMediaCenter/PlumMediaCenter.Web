import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class Loader {
    constructor(
        public loadingCtrl: LoadingController
    ) {
    }

    public minLoadDuration = 1000;

    /**
     * Show a loading message.
     * @return a function that can be called to hide the loader
     */
    show(message: string) {
        let wasDismissed = false;
        let createLoaderPromise = this.loadingCtrl.create({
            message: message
        });
        //when the loader loads, show it
        createLoaderPromise.then((loader) => {
            loader.present();
        });

        let hideLoaderPromise: Promise<void>;
        return function () {
            if (hideLoaderPromise) {
                return hideLoaderPromise;
            } else {
                hideLoaderPromise = createLoaderPromise.then((loader) => {
                    loader.dismiss();
                });
            }
        };
    }

    /**
     * Shows a message for at least minimum amount of time.
     *
     * @return Returns a function that should be called when the calling function is finished with the long operation.
     *         That returned function, when called, returns a promise, which will be resolved once the minimum duration has been met.
     *
     */
    showForMinimum(message: string, durationMilliseconds?: number) {
        durationMilliseconds = durationMilliseconds ? durationMilliseconds : this.minLoadDuration;
        let startTime = new Date();
        let remove = this.show(message);

        let hide = function () {
            return new Promise(async (resolve) => {
                let timeWaited = new Date().getTime() - startTime.getTime();
                //if remove was called shorter than allowed duration, timeout until the full duration
                if (timeWaited < durationMilliseconds) {
                    let remainingTime = durationMilliseconds - timeWaited;
                    setTimeout(async function () {
                        await remove();
                        resolve();
                    }, remainingTime);
                } else {
                    //the time waited was long enough. remove now.
                    await remove();
                    resolve();
                }
            });
        };
        return hide;
    }

    /**
     * Show a loading message for a short duration.
     * @return a promise that is resolved when the loading message is dismissed
     */
    showForDuration(message: string, durationMilliseconds?: number) {
        durationMilliseconds = durationMilliseconds ? durationMilliseconds : this.minLoadDuration;
        let dismiss = this.show(message);
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                dismiss();
                resolve();
            }, durationMilliseconds);
        });
    }
}
