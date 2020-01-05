class CheckerHuman extends CheckerPlayer {

    constructor(scene, checkers, checkerLogic, type) {
        super(scene, checkers, checkerLogic, type)
        CheckerHuman.selectedPiece = null;
        CheckerHuman.lockPicking = false;
    }

    onTurn() { this.unlockSelection(); }

    onJump(piece) { this.lockSelection(piece.ID); }



    handlePick(pickResult) {
        if (this.isPickPiece(pickResult)) {
            if (!this.isPickCaptured(pickResult))
                this.selectPiece(pickResult, false);
            this.checkers.logPiece(pickResult);
        }
        else {
            let tileName = CheckerTile.IDtoName(pickResult);
            this.checkers.logTile(tileName);

            let move = this.checkerLogic.getValidMove(this.getSelectedPiece(), tileName);
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
            let selectedPiece = this.getSelectedPiece();
            selectedPiece.select();
            selectedPiece.highlightAvailableMoves(true);
        }
    }

    deselectPiece() {
        if (CheckerHuman.selectedPiece != null) {
            let selectedPiece = this.getSelectedPiece();
            selectedPiece.deselect();
            selectedPiece.highlightAvailableMoves(false);
            CheckerHuman.selectedPiece = null;
        }
    }

    lockSelection(pieceID) {
        this.deselectPiece();
        this.checkerLogic.updateMoves(true);
        this.selectPiece(pieceID, true);
        this.lockPicking = true;
    }

    unlockSelection() {
        this.deselectPiece();
        CheckerHuman.lockPicking = false;
    }

    isPickCaptured(pickResult) { return this.checkerLogic.pieces[pickResult - 1].captured; }

    isSamePick(pickResult) { return (pickResult - 1) == CheckerHuman.selectedPiece; }

    getPickType(pickResult) { return this.checkerLogic.pieces[pickResult - 1].type; }

    getSelectedPiece() { return this.checkerLogic.pieces[CheckerHuman.selectedPiece]; }


    isPickPiece(pickResult) { return pickResult < 25; }

}
