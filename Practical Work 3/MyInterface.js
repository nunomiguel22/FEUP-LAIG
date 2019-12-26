/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.lookAround = false;
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();

        return true;
    }


    onThemerLoaded() {
        let checkerThemer = this.scene.checkers.checkerThemer;
        let worldFolder = this.gui.addFolder("World Settings");

        worldFolder.add(checkerThemer, "activeTheme",
            Object.keys(checkerThemer.themes)).onChange(checkerThemer.onThemeChange.bind(checkerThemer)).name("Theme");


        worldFolder.add(this.scene, "scaleFactor", 0.1, 10.0).name("Scale");
        worldFolder.open();
    }

    updateComponents() {
        for (let i in this.gui.__controllers) {
            this.gui.__controllers[i].updateDisplay();
        }
    }

    onGraphLoaded() {
        if (this.cameraFolder != null)
            this.gui.removeFolder(this.cameraFolder);

        this.cameraFolder = this.gui.addFolder("Cameras");

        this.cameraFolder.add(this.scene, "selectedCamera",
            this.scene.graph.cameraIds).onChange(this.scene.onCameraChanged.bind(this.scene)).name("Camera");

        this.cameraFolder.add(this.scene, "animationDuration").min(0).name("Swap Time (ms)");

        this.cameraFolder.add(this, "lookAround").onChange(this.onLookAroundChange.bind(this)).name("Look Around").listen();

        this.cameraFolder.open();
    }

    onLookAroundChange() {
        if (this.lookAround)
            this.setActiveCamera(this.scene.mainCamera);
        else {
            this.scene.mainCamera.reset();
            this.setActiveCamera(null);

        }
    }



    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
