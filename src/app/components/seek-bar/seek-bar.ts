import { Component, Input, EventEmitter, Output, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'seek-bar',
    templateUrl: 'seek-bar.html',
    styleUrls: ['seek-bar.scss']
})
export class SeekBarComponent implements OnInit {
    constructor() {
    }

    ngOnInit(): void {
        this.adjustLeftWidth();
    }

    @Input()
    public totalSeconds: number;

    //only set this from the attribute bindings of parents. Don't use for internal setting. Use _current
    @Input()
    public set value(value) {
        if (value !== this._value) {
            this._value = value;
            this.adjustLeftWidth();
            this.computeTimeRemaining();
        }
    }
    public get value() {
        return this._value;
    }
    public _value: number;

    @Output()
    public dragstart = new EventEmitter();

    @Output()
    public dragstop = new EventEmitter();

    @Output()
    public change = new EventEmitter<number>();

    public getPercentComplete() {
        if (this.value === 0) {
            return 0;
        } else {
            return this.value / this.totalSeconds;
        }
    }

    @ViewChild('input') inputElement: ElementRef<HTMLInputElement>;

    public computeTimeRemaining() {
        let totalSeconds = this.totalSeconds - this.value;
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = Math.floor(totalSeconds - (hours * 3600) - (minutes * 60));

        // round seconds
        seconds = Math.round(seconds * 100) / 100;

        let result = (hours < 10 ? '0' + hours : `${hours}`);
        result += ':' + (minutes < 10 ? '0' + minutes : minutes);
        result += ':' + (seconds < 10 ? '0' + seconds : seconds);
        this.hoursMinutesSeconds = result;
    }

    public hoursMinutesSeconds = '00:00:00';

    onInput(event) {
        this.change.emit(this._value);
        this.adjustLeftWidth();
    }

    adjustLeftWidth() {
        const percentComplete = this.getPercentComplete() * 100;
        this.inputElement.nativeElement.style.background = 'linear-gradient(to right, var(--ion-color-primary) 0%, var(--ion-color-primary) ' + percentComplete + '%, #fff ' + percentComplete + '%, white 100%)';
    }
}
