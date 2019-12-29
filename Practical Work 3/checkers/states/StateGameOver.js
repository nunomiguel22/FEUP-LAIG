class StateGameOver {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        if (this.checkers.checkerLogic.winner == "white")
            this.playerName = this.checkers.whitePlayerName;
        else this.playerName = this.checkers.blackPlayerName;

        this.checkers.checkerLogic.gameStarted = false;

        this.message = new GLString(this.scene, this.playerName + " Wins!");
        this.message.setOrtho(true);
        this.message.setSize(0.09);
        this.message.setAlignment("center");
        this.message.setPosition([0, 0.3, 0]);
    }

    handlePick(pickResult) { }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.menuState);
    }

    update(t) { this.checkers.checkerAnimator.update(t); }

    display() {
        this.message.display();
    }
}
