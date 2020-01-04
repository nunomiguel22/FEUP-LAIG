class StateReplay extends State {

    constructor(scene, checkers) {
        super(scene, checkers);
        this.checkerLogic.newGame(this.checkerLogic.gameType, false);
        this.checkerAnimator = this.checkers.checkerAnimator;
        this.checkerAnimator.reset();
        this.checkerSequence = this.checkers.checkerSequence;

        this.gameInfo = new UIGameInfo(this.scene, this.checkers);

        this.moves = [];
    }

    handlePick(pickResult) { }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.menuState);
    }

    undo() { }

    update(t) {
        if (this.checkers.checkerLogic.gameOver) {
            this.checkerSequence.checkerMoves = this.moves;
            this.checkerAnimator.reset();
            this.checkers.changeState(new StateGameOver(this.scene, this.checkers));
            return;
        }
        this.checkerAnimator.update(t);
        if (!this.checkerAnimator.isAnimatingMoves()) {
            let move = this.checkerSequence.popFirstElement();
            if (move) {
                this.checkers.movePiece(move);
                this.moves.push(move);
            }
        }
    }

    display() { this.gameInfo.display(); }

}
