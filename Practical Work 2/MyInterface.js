/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
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

    onGraphLoaded() {

        this.gui.add(this.scene, 'scaleFactor', 0.1, 10.0).name('Scale');

        var setFolder = this.gui.addFolder("Cameras");

        setFolder.add(this.scene, 'selectedCamera', this.scene.cameraIds).onChange(this.scene.onCameraChanged.bind(this.scene)).name('Main');
        setFolder.add(this.scene, 'selectedSecurityCamera', this.scene.cameraIds).onChange(this.scene.onSecCameraChanged.bind(this.scene)).name('Security');
        setFolder.open();
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
