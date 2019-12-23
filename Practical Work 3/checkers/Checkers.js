class Checkers {

    constructor(scene) {
        this.scene = scene;
        // CheckerBoard Theme
        this.checkerThemer = new CheckerThemer(this.scene);

        // CheckerBoard Visual Representation
        this.checkerBoard = null;

        // Checkers Logic
        this.checkerLogic = new CheckerLogic(this.scene);
        // Checkers move sequence
        this.checkerSequence = new CheckerSequence(this.checkerBoard);
    }

    setCheckerBoard(checkerBoard) {
        this.checkerBoard = checkerBoard;
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
            this.checkerLogic.selectPiece(pickResult);
        else {
            console.log(CheckerTile.IDtoName(pickResult));
            if (this.checkerLogic.selectedPiece != null) {
                let tileName = CheckerTile.IDtoName(pickResult);
                let move = new CheckerMove(this.checkerLogic.selectedPiece,
                    this.checkerLogic.getTileFromPiece(this.checkerLogic.selectedPiece).name,
                    tileName);
                this.checkerSequence.addMove(move);
                this.checkerLogic.onTileSelection(tileName);
            }
        }
    }

    undoMove() {
        let move = this.checkerSequence.popMove();
        if (move != null) {
            this.checkerLogic.movePiece(move.piece, move.originTile);
        }
    }
}
