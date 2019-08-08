import { Injectable } from '@angular/core';

@Injectable()
export class Util {

    /**
     * Get a textual description of the difference between two dates
     * @param startDate
     * @param endDate
     */
    getDateDifference(startDate: Date, endDate: Date = new Date()) {

        let milliseconds = endDate.getTime() - startDate.getTime();
        let seconds = Math.floor(milliseconds / 1000);
        milliseconds = milliseconds - (seconds * 1000);
        //get the total number of minutes
        let minutes = Math.floor(seconds / 60);
        seconds = seconds - (minutes * 60);
        let hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);
        let days = Math.floor(hours / 24);
        hours = hours - (days * 24);

        let parts = [];
        if (days > 0) {
            parts.push(`${days} ${(days === 1 ? 'day' : 'days')}`);
        }
        if (hours > 0) {
            parts.push(`${hours} ${(hours === 1 ? 'hour' : 'hours')}`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} ${(minutes === 1 ? 'minute' : 'minutes')}`);
        }
        if (parts.length === 0 && (seconds > 0 || milliseconds > 0)) {
            parts.push('less than a minute');
        }
        let result = parts.join(' ');
        return result;
    }

    timeoutAsync(timeMilliseconds: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, timeMilliseconds);
        });
    }

    lockOrientation(orientations: OrientationLockType[]) {
        let screen = (window.screen as any);
        screen.lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || screen.orientation.lock;
        if (screen && screen.orientation && screen.orientation.lock) {
            if (screen.orientation.lock(orientations)) {
                // Orientation was locked
                console.log('Locked screen orientation to [' + orientations.join(',') + ']');
            } else {
                // Orientation lock failed
                console.log('Unable to lock screen orientiation: lock failed for unknown reason');
            }
        } else {
            console.log('Unable to lock screen orientation: not supported in this browser');
        }
    }

    unlockOrientation() {
        let screen = (window.screen as any);
        let orientation = screen.msOrientation || screen.mozOrientation || screen.orientation;
        if (orientation) {
            orientation.unlock();
        } else {
            console.log('Unable to unlock screen orientiation: not supported in this browser');
        }
    }
}
