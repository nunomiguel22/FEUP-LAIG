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

        this.gui.close();

        return true;
    }


    onThemerLoaded() {
        let checkers = this.scene.checkers;
        let checkerThemer = checkers.checkerThemer;
        let gameInfo = checkers.gameState.gameInfo;


        let worldFolder = this.gui.addFolder("World Settings");

        let themeChangeFun = checkerThemer.onThemeChange.bind(checkerThemer);
        worldFolder.add(checkerThemer, "activeTheme",
            Object.keys(checkerThemer.themes)).onChange(themeChangeFun).name("Theme");

        worldFolder.add(this.scene, "scaleFactor", 0.1, 10.0).name("Scale");
        worldFolder.add(this.scene.fpsCounter, 'enabled').name("FPS Counter");

        worldFolder.open();

        let gameFolder = this.gui.addFolder("Game Settings");

        let updateNamesFun = gameInfo.updateNames.bind(gameInfo);
        gameFolder.add(checkers,
            "whitePlayerName").onChange(updateNamesFun).name("White Player");

        gameFolder.add(checkers, "blackPlayerName").onChange(updateNamesFun).name("Black Player");
        gameFolder.add(checkers, "undo").name("Undo");
        gameFolder.add(checkers, "resetScore").name("Reset Score");
        gameFolder.add(checkers.checkerLogic,
            "maxTurnTime").min(0).onChange(checkers.checkerLogic.updateTurnTimer.bind(checkers.checkerLogic)).name("Turn Timer (s)");


        gameFolder.open();
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
        this.scene.checkers.processKeyDown(event);
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
