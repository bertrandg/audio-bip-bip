

export class BipBipBetter {
    private timeInterval: number | null = null
    private waitingIntensityPercent: number | null = null
    private currentIntensityPercent: number | null = null

    constructor(private context: AudioContext) {}

    get isRunning(): boolean {
        return this.timeInterval !== null;
    }

    get runningInterval(): number | null {
        return this.currentIntensityPercent !== null ? getIntervalFromIntensityPercent(this.currentIntensityPercent) : null;
    }

    startToLevel(percent: number) {
        percent = 100 - Number(percent);
        if(percent < 0) {
            percent = 0;
        }
        else if(percent > 100) {
            percent = 100;
        }
        console.log('startToLevel > ', percent, '% / interval = ', getIntervalFromIntensityPercent(percent));

        // If already looping at right level, do nothing
        if(this.timeInterval !== null && this.waitingIntensityPercent === percent) return;

        // Wait to be effective asap
        this.waitingIntensityPercent = percent;
        
        // No loop running > start it
        if(this.timeInterval === null) {
            this.currentIntensityPercent = this.waitingIntensityPercent;
            this.timeInterval = window.setInterval(() => this.loop(), getIntervalFromIntensityPercent(this.currentIntensityPercent));
            console.log('STARTED FROM ZERO > interval = ', getIntervalFromIntensityPercent(this.currentIntensityPercent));

            this.bip();
        }
    }

    stop() {
        if(this.timeInterval !== null) {
            window.clearInterval(this.timeInterval);
        }

        this.timeInterval = null;
        this.waitingIntensityPercent = null;
        this.currentIntensityPercent = null;
    }

    destroy() {
        this.stop();
    }

    private loop() {
        if(this.timeInterval !== null && this.waitingIntensityPercent !== null && this.waitingIntensityPercent !== this.currentIntensityPercent) {
            window.clearInterval(this.timeInterval);

            this.currentIntensityPercent = this.waitingIntensityPercent;
            this.timeInterval = window.setInterval(() => this.loop(), getIntervalFromIntensityPercent(this.currentIntensityPercent));
            console.log('STARTED FROM LOOP > interval = ', getIntervalFromIntensityPercent(this.currentIntensityPercent));
        }

        this.bip();
    }
    
    private bip() {
        this.sound(100, 520, 200);
    }
    
    private sound(vol: number, freq: number, duration: number) {
        const v = this.context.createOscillator();
        const u = this.context.createGain();
        
        v.connect(u);
        v.frequency.value = freq;
        v.type = 'square';

        u.connect(this.context.destination);
        u.gain.value = vol*.01;
        
        v.start(this.context.currentTime);
        v.stop(this.context.currentTime + duration*.001);
    }
}

function getIntervalFromIntensityPercent(percent: number): number {
    const INTERVAL = {
        MIN: 250,
        MAX: 2000,
    }

    return INTERVAL.MIN + (INTERVAL.MAX - INTERVAL.MIN) * percent/100;
}