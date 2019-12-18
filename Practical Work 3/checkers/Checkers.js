class Checkers {

    constructor(scene) {
        this.scene = scene;
        // CheckerBoard Representation
        this.checkerBoard = new CheckerBoard(this.scene);
        // Sequence of moves
        this.selectedPiece = null;
        this.availableMoves;
        this.checkerSequence = new CheckerSequence(this.checkerBoard);
    }

    isValidMove(selectedPiece, tileID) {
        if (selectedPiece == null || tileID == null)
            return false;

        for (let i = 0; i < this.availableMoves.length; ++i)
            if (this.availableMoves[i] == tileID)
                return true;

        return false;
    }

    generateAvailableMoves(piece) {
        let moves = [];
        let tile = this.checkerBoard.getTileFromPiece(piece);
        if (tile.piece.type == "white") {
            if (tile.topLeft != null) {
                let topLeft = this.checkerBoard.getTile(tile.topLeft);
                if (topLeft.piece == null)
                    moves.push(topLeft.id);
                else if (topLeft.piece.type == "black" && topLeft.topLeft != null) {
                    let topLeft2 = this.checkerBoard.getTile(topLeft.topLeft);
                    if (topLeft2.piece == null)
                        moves.push(topLeft2.id);
                }
            }
            if (tile.topRight != null) {
                let topRight = this.checkerBoard.getTile(tile.topRight);
                if (topRight.piece == null)
                    moves.push(topRight.id);
                else if (topRight.piece.type == "black" && topRight.topRight != null) {
                    let topRight2 = this.checkerBoard.getTile(topRight.topRight);
                    if (topRight2.piece == null)
                        moves.push(topRight2.id);
                }
            }
        }

        if (tile.piece.type == "black") {
            if (tile.bottomLeft != null) {
                let bottomLeft = this.checkerBoard.getTile(tile.bottomLeft);
                if (bottomLeft.piece == null)
                    moves.push(bottomLeft.id);
                else if (bottomLeft.piece.type == "white" && bottomLeft.bottomLeft != null) {
                    let bottomLeft2 = this.checkerBoard.getTile(bottomLeft.bottomLeft);
                    if (bottomLeft2.piece == null)
                        moves.push(bottomLeft2.id);
                }
            }
            if (tile.bottomRight != null) {
                let bottomRight = this.checkerBoard.getTile(tile.bottomRight);
                if (bottomRight.piece == null)
                    moves.push(bottomRight.id);
                else if (bottomRight.piece.type == "white" && bottomRight.bottomRight != null) {
                    let bottomRight2 = this.checkerBoard.getTile(bottomRight.bottomRight);
                    if (bottomRight2.piece == null)
                        moves.push(bottomRight2.id);
                }
            }
        }
        return moves;
    }

    onPieceSelection(pickResult) {
        this.selectedPiece = pickResult - 1;
        this.availableMoves = this.generateAvailableMoves(this.selectedPiece);
    }

    onTileSelection(pickResult) {
        let tileID = this.checkerBoard.tileUIDtoID(pickResult);
        if (this.isValidMove(this.selectedPiece, tileID)) {
            let move = new CheckerMove(this.selectedPiece, this.checkerBoard.getTileFromPiece(this.selectedPiece).id, tileID);
            this.checkerSequence.addMove(move);
            this.checkerBoard.movePiece(this.selectedPiece, tileID);
            this.selectedPiece = null;
        }
    }

    handlePick(pickResult) {
        if (pickResult < 25)
            this.onPieceSelection(pickResult);
        else this.onTileSelection(pickResult);
    }

    init() {
        this.checkerBoard.init();
    }

    undoMove() {
        let move = this.checkerSequence.popMove();
        if (move != null) {
            this.checkerBoard.movePiece(move.piece, move.originTile);
        }
    }
}
