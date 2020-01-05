class CheckerMove {

    constructor(piece, destinationTile, capturedPiece) {
        this.piece = piece;
        this.originTile = this.piece.tile;
        this.destinationTile = destinationTile;

        this.capturedPiece = capturedPiece;
        if (this.capturedPiece != null)
            this.capturedTile = this.capturedPiece.tile;
    }

    hasCapture() { return this.capturedPiece ? true : false; }
}
