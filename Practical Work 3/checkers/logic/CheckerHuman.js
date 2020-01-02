class CheckerHuman {

    constructor(scene, checkers, checkerLogic) {
        this.scene = scene;
        this.checkers = checkers;
        this.checkerLogic = checkerLogic;
        CheckerHuman.selectedPiece = null;
        CheckerHuman.lockPicking = false;
    }

    onTurn() {
        this.unlockSelection();
    }

    onJump(piece) { this.lockSelection(piece.ID); }

    handlePick(pickResult) {
        if (this.isPickPiece(pickResult))
            this.selectPiece(pickResult, false);
        else {
            let tileName = CheckerTile.IDtoName(pickResult);
            this.checkers.logTile(tileName);

            let move = this.checkerLogic.getValidMove(tileName);
            if (move)
                this.checkers.movePiece(move);
        }
    }

    isPiecePickable(ID) {
        if (CheckerHuman.lockPicking)
            return false;

        if (this.checkerLogic.playerTurn)
            return ID >= 12;
        else return ID < 12;
    }

    selectPiece(pickResult, captureOnly) {
        let pickID = pickResult - 1;
        if (captureOnly || (!this.isSamePick(pickResult) && this.isPiecePickable(pickID))) {
            this.deselectPiece();
            CheckerHuman.selectedPiece = pickID;
            this.checkerLogic.pieces[CheckerHuman.selectedPiece].select();
            this.checkerLogic.availableMoves =
                this.checkerLogic.generatePossibleMoves(CheckerHuman.selectedPiece, captureOnly);
            this.checkerLogic.highlightAvailableMoves();
        }
    }

    deselectPiece() {
        if (CheckerHuman.selectedPiece != null) {
            for (let i in this.checkerLogic.availableMoves)
                this.checkerLogic.availableMoves[i].destinationTile.highlight = false;
            this.checkerLogic.pieces[CheckerHuman.selectedPiece].deselect();
            CheckerHuman.selectedPiece = null;
        }
    }

    lockSelection(pieceID) {
        this.selectPiece(pieceID, true);
        this.lockPicking = true;
    }

    unlockSelection() {
        this.deselectPiece();
        CheckerHuman.lockPicking = false;
    }

    isSamePick(pickResult) { return (pickResult - 1) == CheckerHuman.selectedPiece; }

    getPickType(pickResult) {
        return this.checkerLogic.pieces[pickResult - 1].type;
    }


    isPickPiece(pickResult) { return pickResult < 25; }

}
