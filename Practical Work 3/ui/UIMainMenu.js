class UIMainMenu {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.backgroundRect = new MyRectangle(this.scene, null, -0.30, 0.30, -0.40, 0.40);
        this.backgroundMat = new CGFappearance(this.scene);
        this.backgroundMat.setEmission(0.6, 0.6, 0.6, 0.2);
        this.backgroundMat.loadTexture("scenes/images/menu/background.jpg");

        this.newGameString = new UIString(this.scene, "New Game");
        this.newGameString.setColor(0.0, 0.0, 0.3, 1.0);
        this.newGameString.setSize(0.1);
        this.newGameString.setAlignment("center");
        this.newGameString.setPickID(200);
    }

    displayNewGame() {
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.2, 0);
        this.newGameString.display();

        this.scene.popMatrix();
    }

    displayBackground() {
        this.backgroundMat.apply();
        this.backgroundRect.display();

    }

    display() {
        this.displayBackground();
        this.displayNewGame();
    }
}
