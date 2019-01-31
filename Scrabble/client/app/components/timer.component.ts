import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

const HALF_TIME = 150;
const QUARTER_TIME = 75;
const FIVE_MINUTES = 300;

@Component({
    selector: 'timer-selector',
    templateUrl: 'assets/templates/timer-component-template.html'
})
export class TimerComponent {
    color = "";
    time = FIVE_MINUTES;
    timer = Observable.timer(0, 1000);
    sub = this.timer.subscribe(s => {
      this.time -= 1;
    });

    timeToString(time: number): string
    {
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        let ret: string = String(m) + ":";
        if (s < 10)
        {
        ret += "0";
        }
        ret += String(s);
        return ret;
    }

    getColor()
    {
        if (this.time > HALF_TIME)
        {
            this.color = "primary";
        }
        else if (this.time > QUARTER_TIME && this.time < HALF_TIME)
        {
            this.color = "accent";
        }
        else if (this.time < QUARTER_TIME)
        {
            this.color = "warn";
        }
        return this.color;
    }

}
