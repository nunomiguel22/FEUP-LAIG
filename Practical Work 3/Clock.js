
class Clock {

    constructor() {
        this.firstTime = 0;
        this.time = 0;
    }

    update() { this.time = Date.now(); }

    reset() { this.firstTime = Date.now(); }

    timeElapsed() { return (this.time - this.firstTime); }

    timeElapsedSeconds() { return Math.floor((this.time - this.firstTime) / 1000); }
}
