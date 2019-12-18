class CheckerSequence {

    constructor() {
        this.checkerMoves = [];
        this.moves = 0;
    }

    addMove(move) {
        ++this.moves;
        this.checkerMoves.push(move);
    }

    popMove() {
        if (this.moves > 0) {
            --this.moves;
            return this.checkerMoves.pop();
        }
        else return null;
    }
}
