class UIMainMenu {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
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
    }

    displayNewGame() {
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.2, 0);

        this.scene.popMatrix();
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
        this.scene.popMatrix();
    }
}
