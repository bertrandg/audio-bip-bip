
export enum BipBipSpeedLevelEnum {
    SLOW = 'SLOW',
    NORMAL = 'NORMAL',
    FAST = 'FAST',
}

export class BipBip {
    private timeInterval: number | null = null
    private waitingLevel: BipBipSpeedLevelEnum | null = null
    private currentLevel: BipBipSpeedLevelEnum | null = null

    constructor(private context: AudioContext) {}

    get isRunning(): boolean {
        return this.timeInterval !== null;
    }

    get runningInterval(): number {
        return this.getIntervalFromLevel(this.currentLevel);
    }

    startToLevel(level: BipBipSpeedLevelEnum) {
        // If already looping at right level, do nothing
        if(this.timeInterval !== null && this.waitingLevel === level) return;

        // Wait to be effective asap
        this.waitingLevel = level;
        
        // No loop running > start it
        if(this.timeInterval === null) {
            this.currentLevel = this.waitingLevel;

            this.timeInterval = window.setInterval(() => this.loop(), this.getIntervalFromLevel(this.currentLevel));
            this.bip();
        }
    }

    loop() {
        if(this.timeInterval !== null && this.waitingLevel && this.waitingLevel !== this.currentLevel) {
            window.clearInterval(this.timeInterval);
            this.timeInterval = window.setInterval(() => this.loop(), this.getIntervalFromLevel(this.waitingLevel));
            this.currentLevel = this.waitingLevel;
        }

        this.bip();
    }

    stop() {
        if(this.timeInterval !== null) {
            window.clearInterval(this.timeInterval);
        }

        this.timeInterval = null;
        this.waitingLevel = null;
        this.currentLevel = null;
    }
    
    private getIntervalFromLevel(level: BipBipSpeedLevelEnum): number {
        switch(level) {
            case BipBipSpeedLevelEnum.SLOW: return 1400;
            case BipBipSpeedLevelEnum.NORMAL: return 900;
            case BipBipSpeedLevelEnum.FAST: return 500;
        }
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
