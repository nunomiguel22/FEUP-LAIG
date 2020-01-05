/**
 * Class responsible for managing real time
 * @constructor
 */
class Clock {

    constructor() {
        this.firstTime = 0;
        this.time = 0;
        this.stopClock = false;
    }

    update() {
        if (!this.stopClock)
            this.time = Date.now();
    }

    stop() { this.stopClock = true; }

    continue() { this.stopClock = false; }

    reset() { this.firstTime = Date.now(); }

    timeElapsed() { return (this.time - this.firstTime); }

    timeElapsedSeconds() { return Math.floor((this.time - this.firstTime) / 1000); }
}
