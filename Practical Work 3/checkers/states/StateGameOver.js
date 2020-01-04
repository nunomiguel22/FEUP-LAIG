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
        this.winnerMessage.setPosition(0.0, 0.7, 0.0);
        this.winnerMessage.setColor(0.8, 0.8, 0.8, 1.0);
        this.winnerMessage.setSize(0.08);
        this.winnerMessage.setAlignment("center");

        this.contMessage = new UIString(this.scene, "Press Escape to watch replay or play a new game");
        this.contMessage.setOrtho(true);
        this.contMessage.setPosition(0.0, 0.6, 0.0);
        this.contMessage.setColor(0.8, 0.8, 0.8, 1.0);
        this.contMessage.setSize(0.04);
        this.contMessage.setAlignment("center");
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
    }
}
