/**
 * Class displays game information
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {checkers} checkers  Reference to checkers object
 */
class UIGameInfo {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.checkerLogic = checkers.checkerLogic;

        this.player1 = new UIString(this.scene, this.checkers.blackPlayerName);
        this.player1.setOrtho(true);
        this.player1.setPosition(-0.9, 0.7, 0.0);
        this.player1.setColor(0.4, 0.4, 0.4, 1.0);
        this.player1.setSize(0.04);


        this.p1Pieces = new UIString(this.scene, " Pieces 12");
        this.p1Pieces.setOrtho(true);
        this.p1Pieces.setPosition(-0.9, 0.61, 0.0);
        this.p1Pieces.setColor(0.4, 0.4, 0.4, 1.0);
        this.p1Pieces.setSize(0.04);

        this.p1Score = new UIString(this.scene, " Score 0");
        this.p1Score.setOrtho(true);
        this.p1Score.setPosition(-0.9, 0.65, 0.0);
        this.p1Score.setColor(0.4, 0.4, 0.4, 1.0);
        this.p1Score.setSize(0.04);

        this.player2 = new UIString(this.scene, this.checkers.whitePlayerName + "  ");
        this.player2.setOrtho(true);
        this.player2.setPosition(0.7, 0.7, 0.0);
        this.player2.setColor(0.8, 0.8, 0.8, 1.0);
        this.player2.setSize(0.04);

        this.p2Pieces = new UIString(this.scene, " Pieces 12");
        this.p2Pieces.setOrtho(true);

        this.p2Pieces.setPosition(0.7, 0.61, 0.0);
        this.p2Pieces.setColor(0.8, 0.8, 0.8, 1.0);
        this.p2Pieces.setSize(0.04);

        this.p2Score = new UIString(this.scene, " Score 0");
        this.p2Score.setOrtho(true);
        this.p2Score.setPosition(0.7, 0.65, 0.0);
        this.p2Score.setColor(0.8, 0.8, 0.8, 1.0);
        this.p2Score.setSize(0.04);

        this.playerTurn = new UIString(this.scene, " TURN");
        this.playerTurn.setOrtho(true);
        this.playerTurn.setPosition(-0.9, 0.4, 0.0);
        this.playerTurn.setColor(0.7, 0.1, 0.1, 1.0);
        this.playerTurn.setSize(0.04);


        this.turn = new UIString(this.scene, "Turn: " + this.checkerLogic.turn);
        this.turn.setOrtho(true);
        this.turn.setPosition(0.0, 0.90, 0.0);
        this.turn.setAlignment("center");
        this.turn.setColor(0.6, 0.6, 0.6, 1.0);
        this.turn.setSize(0.04);

        this.turnTimer = new UIString(this.scene, "");
        this.turnTimer.setOrtho(true);
        this.turnTimer.setPosition(-0.9, 0.60, 0.0);
        this.turnTimer.setColor(0.4, 0.4, 0.4, 1.0);
        this.turnTimer.setSize(0.04);

        this.timeElapsed = new UIString(this.scene, "Time Elapsed: "
            + this.checkerLogic.gameClock.timeElapsedSeconds());
        this.timeElapsed.setOrtho(true);
        this.timeElapsed.setPosition(0.0, 0.84, 0.0);
        this.timeElapsed.setAlignment("center");
        this.timeElapsed.setColor(0.7, 0.7, 0.7, 1.0);
        this.timeElapsed.setSize(0.04);
    }

    updateNames() {
        this.player1.setString(this.checkers.whitePlayerName);
        this.player2.setString(this.checkers.blackPlayerName);
    }

    displayPlayer1Info() {
        this.p1Pieces.setString(" Pieces " + this.checkerLogic.whitePiecesRemaining());
        this.p1Pieces.display();
        this.p1Score.display();
        this.player1.display();
    }

    displayPlayer2Info() {
        this.p2Pieces.setString(" Pieces " + this.checkerLogic.blackPiecesRemaining());
        this.p2Pieces.display();
        this.p2Score.display();
        this.player2.display();
    }

    display() {

        if (this.checkerLogic.playerTurn) {
            this.playerTurn.setPosition(-0.9, 0.55, 0.0);
            this.turnTimer.setPosition(-0.9, 0.49, 0.0);
        }
        else {
            this.playerTurn.setPosition(0.7, 0.55, 0.0);
            this.turnTimer.setPosition(0.7, 0.49, 0.0);
        }

        if (this.checkerLogic.turnTimerEnabled) {
            let turnTime = this.checkerLogic.maxTurnTime -
                this.checkerLogic.turnClock.timeElapsedSeconds();

            let colorMod = turnTime / this.checkerLogic.maxTurnTime;
            this.turnTimer.setColor(1.0, colorMod, colorMod, 1.0);
            this.turnTimer.setString(" Turn Time:" + turnTime);
            this.turnTimer.display();
        }


        this.timeElapsed.setString(" Time Elapsed:"
            + this.checkerLogic.gameClock.timeElapsedSeconds());
        this.timeElapsed.display();
        this.playerTurn.display();
        this.turn.setString("Turn: " + this.checkerLogic.turn);
        this.turn.display();
        this.displayPlayer1Info();
        this.displayPlayer2Info();
    }
}
