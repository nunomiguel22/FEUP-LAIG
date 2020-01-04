class CheckerSequence {

    constructor(checkerLogic) {
        this.checkerLogic = checkerLogic;
        this.checkerMoves = [];
    }

    addMove(move) { this.checkerMoves.push(move); }

    undo() {
        if (this.checkerMoves.length) {
            this.checkerLogic.resetGame();
            this.checkerMoves.pop();
            for (let i in this.checkerMoves)
                this.checkerLogic.makePlay(this.checkerMoves[i], false);

            this.checkerLogic.updateMoves(false);
        }
    }
    popFirstElement() {
        if (this.checkerMoves.length)
            return this.checkerMoves.shift();
        else return null;
    }

    reset() { this.checkerMoves = []; }
}
