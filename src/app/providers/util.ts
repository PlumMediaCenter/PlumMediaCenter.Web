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
}
