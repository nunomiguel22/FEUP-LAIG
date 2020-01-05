/**
 * Game Over state class, displays final game info
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {checkers} checkers  Reference to checkers object
 */
class StateGameOver extends State {

    constructor(scene, checkers) {
        super(scene, checkers);
        if (this.checkerLogic.winner == "white")
            this.playerName = this.checkers.whitePlayerName;
        else this.playerName = this.checkers.blackPlayerName;



        this.checkerLogic.gameStarted = false;
        this.checkers.checkerAnimator.reset();

        this.winnerMessage = new UIString(this.scene, this.playerName + " Wins!");
        this.winnerMessage.setOrtho(true);
        this.winnerMessage.setPosition(0.0, 0.86, 0.0);
        this.winnerMessage.setColor(0.8, 0.8, 0.8, 1.0);
        this.winnerMessage.setSize(0.08);
        this.winnerMessage.setAlignment("center");

        this.contMessage = new UIString(this.scene, "Press Escape to watch replay or play a new game");
        this.contMessage.setOrtho(true);
        this.contMessage.setPosition(0.0, 0.77, 0.0);
        this.contMessage.setColor(0.8, 0.8, 0.8, 1.0);
        this.contMessage.setSize(0.04);
        this.contMessage.setAlignment("center");

        let timeElapsed = Math.floor(this.checkerLogic.gameClock.timeElapsed() / 1000);
        this.gameDurationMessage = new UIString(this.scene,
            "Game Duration: " + timeElapsed + "s");
        this.gameDurationMessage.setOrtho(true);
        this.gameDurationMessage.setPosition(0.0, 0.70, 0.0);
        this.gameDurationMessage.setColor(0.8, 0.8, 0.8, 1.0);
        this.gameDurationMessage.setSize(0.04);
        this.gameDurationMessage.setAlignment("center");


        this.p1Score = new UIString(this.scene, this.checkers.blackPlayerName +
            " score: " + CheckerPlayer.player1Score);
        this.p1Score.setOrtho(true);
        this.p1Score.setPosition(0.0, 0.61, 0.0);
        this.p1Score.setColor(0.8, 0.8, 0.8, 1.0);
        this.p1Score.setSize(0.035);
        this.p1Score.setAlignment("center");

        this.p2Score = new UIString(this.scene, this.checkers.whitePlayerName +
            " score: " + CheckerPlayer.player2Score);
        this.p2Score.setOrtho(true);
        this.p2Score.setPosition(0.0, 0.55, 0.0);
        this.p2Score.setColor(0.8, 0.8, 0.8, 1.0);
        this.p2Score.setSize(0.035);
        this.p2Score.setAlignment("center");
    }

    handlePick(pickResult) { }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.menuState);
    }

    update(t) { }

    display() {
        this.winnerMessage.display();
        this.contMessage.display();
        this.gameDurationMessage.display();
        this.p1Score.display();
        this.p2Score.display();
    }
}
