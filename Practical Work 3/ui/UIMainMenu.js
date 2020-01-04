class UIMainMenu {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.checkerLogic = checkers.checkerLogic;
        this.backgroundRect = new MyRectangle(this.scene, null, -9, 9, -15, 15);
        this.backgroundMat = new CGFappearance(this.scene);
        this.backgroundMat.setEmission(0.6, 0.6, 0.6, 0.2);
        this.backgroundMat.loadTexture("scenes/images/menu/background.jpg");

        this.newGameString = new UIString(this.scene, "New Game");
        this.newGameString.setColor(1.0, 1.0, 1.0, 1.0);
        this.newGameString.setPosition(0, 7, 0.1);
        this.newGameString.setSize(2);
        this.newGameString.setAlignment("center");
        this.newGameString.setPickID(200);

        this.replayString = new UIString(this.scene, "Replay last game");
        this.replayString.setColor(1.0, 1.0, 1.0, 1.0);
        this.replayString.setPosition(0, 0, 0.1);
        this.replayString.setSize(2);
        this.replayString.setAlignment("center");
        this.replayString.setPickID(201);
    }


    displayBackground() {
        this.backgroundMat.apply();
        this.backgroundRect.display();
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-40, 100, 0);
        this.scene.rotate(Math.PI / 4, 0, 1, 0);

        this.displayBackground();
        this.newGameString.display();
        if (this.checkerLogic.gameOver && this.checkers.checkerSequence.checkerMoves.length)
            this.replayString.display();

        this.scene.popMatrix();
    }
}
