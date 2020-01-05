/**
 * Class displays the main menu
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {checkers} checkers  Reference to checkers object
 * @param {menuState} menuState  Reference to the main menu state
 */
class UIMainMenu {

    constructor(scene, checkers, menuState) {
        this.scene = scene;
        this.checkers = checkers;
        this.menuState = menuState;
        this.checkerLogic = checkers.checkerLogic;
        this.backgroundRect = new MyRectangle(this.scene, null, -9, 9, -15, 15);
        this.backgroundMat = new CGFappearance(this.scene);
        this.camera = new CGFextendedCamera(Math.PI / 4, 0.1, 1000, vec3.fromValues(0, 160, 50),
            vec3.fromValues(0, 70, 0));

        this.backgroundMat.setEmission(0.6, 0.6, 0.6, 0.2);
        this.backgroundMat.loadTexture("scenes/images/menu/background.jpg");

        this.newGameString = new UIString(this.scene, "New Game");
        this.newGameString.setAlwaysVisible(true);
        this.newGameString.setColor(1.0, 1.0, 1.0, 1.0);
        this.newGameString.setPosition(0, 11, 0.1);
        this.newGameString.setSize(2);
        this.newGameString.setAlignment("center");
        this.newGameString.setPickID(200);

        this.replayString = new UIString(this.scene, "Replay last game");
        this.replayString.setAlwaysVisible(true);
        this.replayString.setColor(1.0, 1.0, 1.0, 1.0);
        this.replayString.setPosition(0, -7, 0.1);
        this.replayString.setSize(2);
        this.replayString.setAlignment("center");
        this.replayString.setPickID(201);

        this.p1String = new UIString(this.scene, "Player 1");
        this.p1String.setAlwaysVisible(true);
        this.p1String.setColor(1.0, 1.0, 1.0, 1.0);
        this.p1String.setPosition(0, 8.2, 0.1);
        this.p1String.setSize(1.8);
        this.p1String.setAlignment("center");

        this.p1Type = new UIString(this.scene, "Human");
        this.p1Type.setAlwaysVisible(true);
        this.p1Type.setColor(1.0, 1.0, 1.0, 1.0);
        this.p1Type.setPosition(0, 5.2, 0.1);
        this.p1Type.setSize(1.7);
        this.p1Type.setAlignment("center");

        this.p1LArrow = new UIString(this.scene, " < ");
        this.p1LArrow.setAlwaysVisible(true);
        this.p1LArrow.setColor(1.0, 1.0, 1.0, 1.0);
        this.p1LArrow.setPosition(-7, 5.2, 0.1);
        this.p1LArrow.setSize(2);
        this.p1LArrow.setAlignment("center");
        this.p1LArrow.setPickID(202);

        this.p1RArrow = new UIString(this.scene, " > ");
        this.p1RArrow.setAlwaysVisible(true);
        this.p1RArrow.setColor(1.0, 1.0, 1.0, 1.0);
        this.p1RArrow.setPosition(7, 5.2, 0.1);
        this.p1RArrow.setSize(2);
        this.p1RArrow.setAlignment("center");
        this.p1RArrow.setPickID(203);

        this.p2String = new UIString(this.scene, "Player 2");
        this.p2String.setAlwaysVisible(true);
        this.p2String.setColor(1.0, 1.0, 1.0, 1.0);
        this.p2String.setPosition(0, 1.5, 0.1);
        this.p2String.setSize(2);
        this.p2String.setAlignment("center");

        this.p2Type = new UIString(this.scene, "Human");
        this.p2Type.setAlwaysVisible(true);
        this.p2Type.setColor(1.0, 1.0, 1.0, 1.0);
        this.p2Type.setPosition(0, -1.5, 0.1);
        this.p2Type.setSize(1.7);
        this.p2Type.setAlignment("center");

        this.p2LArrow = new UIString(this.scene, " < ");
        this.p2LArrow.setAlwaysVisible(true);
        this.p2LArrow.setColor(1.0, 1.0, 1.0, 1.0);
        this.p2LArrow.setPosition(-7, -1.5, 0.1);
        this.p2LArrow.setSize(2);
        this.p2LArrow.setAlignment("center");
        this.p2LArrow.setPickID(204);

        this.p2RArrow = new UIString(this.scene, " > ");
        this.p2RArrow.setAlwaysVisible(true);
        this.p2RArrow.setColor(1.0, 1.0, 1.0, 1.0);
        this.p2RArrow.setPosition(7, -1.5, 0.1);
        this.p2RArrow.setSize(2);
        this.p2RArrow.setAlignment("center");
        this.p2RArrow.setPickID(205);
    }


    displayBackground() {

        this.backgroundMat.apply();
        this.backgroundRect.display();

    }

    displayPlayer1Options() {
        this.p1String.display();
        this.p1LArrow.display();
        this.p1Type.setString(this.menuState.p1Type);
        this.p1Type.display();
        this.p1RArrow.display();
    }

    displayPlayer2Options() {
        this.p2String.display();
        this.p2LArrow.display();
        this.p2Type.setString(this.menuState.p2Type);
        this.p2Type.display();
        this.p2RArrow.display();
    }

    display() {
        this.scene.setDepthTest(false);
        CGFextendedCamera.swapSceneCamera(this.scene, this.camera, false);

        this.scene.pushMatrix();
        this.scene.translate(-40, 100, 0);
        this.scene.rotate(Math.PI / 4, 0, 1, 0);

        this.displayBackground();
        this.newGameString.display();
        this.displayPlayer1Options();
        this.displayPlayer2Options();

        if (this.checkerLogic.gameOver && this.checkers.checkerSequence.checkerMoves.length)
            this.replayString.display();

        this.scene.popMatrix();

        CGFextendedCamera.applyPreviousTransform(this.scene);
        this.scene.setDepthTest(true);
    }
}
