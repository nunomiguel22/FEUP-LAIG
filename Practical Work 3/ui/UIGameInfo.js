class UIGameInfo {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;


        this.player1 = new UIString(this.scene, this.checkers.whitePlayerName);
        this.player1.setOrtho(true);
        this.player1.setPosition(-1.0, 0.7, 0.0);
        this.player1.setColor(0.8, 0.8, 0.8, 1.0);
        this.player1.setSize(0.08);

        this.p1Pieces = new UIString(this.scene, " Pieces:12");
        this.p1Pieces.setOrtho(true);
        this.p1Pieces.setPosition(-1.0, 0.65, 0.0);
        this.p1Pieces.setColor(0.8, 0.8, 0.8, 1.0);
        this.p1Pieces.setSize(0.06);

        this.player2 = new UIString(this.scene, this.checkers.blackPlayerName);
        this.player2.setOrtho(true);
        this.player2.setPosition(0.7, 0.7, 0.0);
        this.player2.setColor(0.4, 0.4, 0.4, 1.0);
        this.player2.setSize(0.08);
        this.player2.setAlignment("right");

        this.p2Pieces = new UIString(this.scene, " Pieces:");
        this.p2Pieces.setAlignment("right");
        this.p2Pieces.setOrtho(true);
        this.p2Pieces.setPosition(0.7, 0.65, 0.0);
        this.p2Pieces.setColor(0.4, 0.4, 0.4, 1.0);
        this.p2Pieces.setSize(0.06);

        this.turn = new UIString(this.scene, " TURN");
        this.turn.setOrtho(true);
        this.turn.setPosition(0.7, 0.6, 0.0);
        this.turn.setAlignment("right");
        this.turn.setColor(0.7, 0.1, 0.1, 1.0);
        this.turn.setSize(0.06);

        /*         this.scene.textRenderer.strings.push(this.player1);
                this.scene.textRenderer.strings.push(this.player2);
                this.scene.textRenderer.strings.push(this.p1Pieces);
                this.scene.textRenderer.strings.push(this.p2Pieces);
                this.scene.textRenderer.strings.push(this.turn); */
    }

    updateNames() {
        this.player1.setString(this.checkers.whitePlayerName);
        this.player2.setString(this.checkers.blackPlayerName);
    }

    displayPlayer1Info() {
        this.p1Pieces.setString(" Pieces:" + this.checkers.checkerLogic.getWhitePiecesLeft());
        this.p1Pieces.display();
        this.player1.display();
    }

    displayPlayer2Info() {
        this.p2Pieces.setString(" Pieces:" + this.checkers.checkerLogic.getBlackPiecesLeft());
        this.p2Pieces.display();
        this.player2.display();
    }

    display() {

        if (this.checkers.checkerLogic.gameMode.playerTurn) {
            this.turn.setPosition(0.7, 0.6, 0.0);
            this.turn.setAlignment("right");
        }
        else {
            this.turn.setAlignment("left");
            this.turn.setPosition(-1, 0.6, 0.0);

        }

        this.turn.display();
        this.displayPlayer1Info();
        this.displayPlayer2Info();
    }
}
