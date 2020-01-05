/**
 * Class represents player moves
 * @constructor
 * @param {piece} piece  Reference to piece making the move
 * @param {destinationTile} destinationTile  Reference to the piece's destination tile
 * @param {capturedPiece} capturedPiece  Reference to the capture piece if any
 */
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
