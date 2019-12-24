class CheckerSequence {

    constructor(checkerLogic) {
        this.checkerLogic = checkerLogic;
        this.checkerMoves = [];
        this.moves = 0;
    }

    addMove(tileName) {
        let move = new CheckerMove(this.checkerLogic.selectedPiece,
            this.checkerLogic.getTileFromPiece(this.checkerLogic.selectedPiece).name,
            tileName);

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
