import { Component, Input } from '@angular/core';

@Component({
    selector: 'progress-sparse',
    templateUrl: 'progress-sparse.html',
    styleUrls: ['progress-sparse.scss']
})
export class ProgressSparseComponent {

    constructor() {
    }
    @Input()
    public set min(value) {
        this._min = value;
        this.calculate();
    }
    public get min() {
        return this._min;
    }
    private _min: number;

    @Input()
    public set max(value) {
        this._max = value;
        this.calculate();
    }
    public get max() {
        return this._max;
    }
    private _max: number;

    @Input()
    public set lower(value) {
        this._lower = value;
        this.calculate();
    }
    public get lower() {
        return this._lower;
    }
    private _lower: number;

    @Input()
    public set upper(value) {
        this._upper = value;
        this.calculate();
    }
    public get upper() {
        return this._upper;
    }
    private _upper: number;

    //TODO - this was added to resolve compile errors, but is not used anywhere
    public showLowerUpper: any;

    @Input()
    public unit?: string;

    public innerLeftLeftboundPercent: number;
    public innerRightRightboundPercent: number;

    public calculate() {
        this.innerLeftLeftboundPercent = this.getInnerLeftLeftboundPercent();
        this.innerRightRightboundPercent = this.getInnerRightLeftboundPercent();
    }

    public getInnerBarCss() {
        let widthPercent = this.innerRightRightboundPercent - this.innerLeftLeftboundPercent;
        return {
            left: `${this.innerLeftLeftboundPercent}%`,
            width: `${widthPercent}%`
        };
    }

    public getInnerLeftLeftboundPercent() {
        let zeroedMax = this.max - this.min;
        let zeroedLower = this.lower - this.min;
        let val = (zeroedLower / zeroedMax) * 100;
        //set a default if val is bogus
        val = !isNaN(val) && val >= 0 ? val : 0;
        //value cannot be larger than 99 so we at least show SOMETHING
        val = val > 99 ? 99 : val;
        //force a whole number
        val = Math.floor(val);

        return val;
    }

    public getInnerRightLeftboundPercent() {
        let zeroedMax = this.max - this.min;
        let zeroedUpper = this.upper - this.min;
        let val = (zeroedUpper / zeroedMax) * 100;
        //if the value is bogus, use a default
        val = !isNaN(val) && val <= 100 ? val : 100;
        //the value cannot be smaller than zero
        val = val < 1 ? 1 : val;
        //force a whole number
        val = Math.ceil(val);
        return val;
    }
}
