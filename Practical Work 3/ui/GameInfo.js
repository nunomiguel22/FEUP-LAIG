class GameInfo {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;


        this.player1 = new UIString(this.scene, this.checkers.whitePlayerName);
        this.player1.setOrtho(true);
        this.player1.setPosition(-1.0, 0.7, 0.0);
        this.player1.setColor(0.8, 0.8, 0.8, 1.0);
        this.player1.setSize(0.06);

        this.player2 = new UIString(this.scene, this.checkers.blackPlayerName);
        this.player2.setOrtho(true);
        this.player2.setPosition(0.7, 0.7, 0.0);
        this.player2.setColor(0.4, 0.4, 0.4, 1.0);
        this.player2.setSize(0.06);
        this.player2.setAlignment("right");
    }

    updateNames() {
        this.player1.setString(this.checkers.whitePlayerName);
        this.player2.setString(this.checkers.blackPlayerName);
    }

    displayPlayer1Info() {
        this.player1.display();
    }

    displayPlayer2Info() {
        this.player2.display();
    }

    display() {
        this.displayPlayer1Info();
        this.displayPlayer2Info();
    }
}
