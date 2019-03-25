import { Component } from '@angular/core';
import { BipBip, BipBipSpeedLevelEnum } from './bipBip';
import { BipBipBetter } from './bipBipBetter';

@Component({
  selector: 'my-app',
  styles: [`
    :host > div {
      margin: 5px;
      padding: 5px;
      border: 1px solid black;
    }
    h2 {
      margin: 0;
    }
  `],
  template: `
    <div>
      <h2>BipBip 3 levels</h2>
      <button (click)="bip1.startToLevel(bipBipSpeedLevelEnum.SLOW)">SLOW</button>
      <button (click)="bip1.startToLevel(bipBipSpeedLevelEnum.NORMAL)">NORMAL</button>
      <button (click)="bip1.startToLevel(bipBipSpeedLevelEnum.FAST)">FAST</button>
      <button [disabled]="!bip1.isRunning" (click)="bip1.stop()">STOP</button>
      <hr>
      <p>RUNNING: <b>{{ bip1.isRunning }}</b></p>
      <p>INTERVAL: <b>{{ bip1.runningInterval || '-' }}ms</b></p>
    </div>
    <div>
      <h2>BipBip with percentage</h2>
      <input type="range" min="0" max="100" #sliderEl (input)="bip2.startToLevel(sliderEl.value)">
      <span>{{ sliderEl.value }}%</span>
      <button [disabled]="!bip2.isRunning" (click)="bip2.stop()">STOP</button>
      <hr>
      <p>RUNNING: <b>{{ bip2.isRunning }}</b></p>
      <p>INTERVAL: <b>{{ bip2.runningInterval || '-' }}ms</b></p>
    </div>`,
})
export class AppComponent {
  audioContext = new AudioContext()
  bipBipSpeedLevelEnum = BipBipSpeedLevelEnum;
  bip1 = new BipBip(this.audioContext);
  bip2 = new BipBipBetter(this.audioContext);

}
