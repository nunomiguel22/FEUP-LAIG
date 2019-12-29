class UIFPSCounter {

    constructor(scene) {
        this.scene = scene;
        this.textRenderer = this.scene.textRenderer;
        this.currentFPS = 0;
        this.fps = 0;
        this.startTime = 0;

        this.fpsString = new UIString(this.scene, "FPS 0");
        this.fpsString.setOrtho(true);
        this.fpsString.setColor(0.0, 0.6, 0.0, 1.0);
        this.fpsString.setPosition(-1.0, 0.95, 0.0);
        this.fpsString.setSize(0.035);
        this.enabled = false;
        this.log = true;
    }

    start() {
        if (this.enabled && !this.startTime)
            this.startTime = Date.now();
    }

    end() {
        if (this.enabled) {
            ++this.currentFPS;
            if (Date.now() - this.startTime >= 1000) {
                this.fps = this.currentFPS - 1;
                this.startTime = 0;
                this.currentFPS = 0;
                this.fpsString.setString("FPS " + this.fps);
                if (this.log)
                    console.log("FPS: " + this.fps);
            }
        }
    }

    display() {
        if (this.enabled) {
            this.end();
            this.fpsString.display();
            this.start();
        }
    }
}
