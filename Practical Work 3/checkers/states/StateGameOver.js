class StateGameOver extends State {

    constructor(scene, checkers) {
        super(scene, checkers);
        if (this.checkerLogic.winner == "white")
            this.playerName = this.checkers.whitePlayerName;
        else this.playerName = this.checkers.blackPlayerName;

        this.checkerLogic.gameStarted = false;
        this.checkers.checkerAnimator.reset();

        this.message = new UIString(this.scene, this.playerName + " Wins!");
        this.message.setOrtho(true);
        this.message.setPosition(0.0, 0.7, 0.0);
        this.message.setColor(0.8, 0.8, 0.8, 1.0);
        this.message.setSize(0.08);
        this.message.setAlignment("center");
    }

    handlePick(pickResult) { }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.menuState);
    }

    update(t) { }

    display() {
        this.message.display();
    }
}
