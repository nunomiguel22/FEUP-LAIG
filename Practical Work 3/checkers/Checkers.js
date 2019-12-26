class Checkers {

    constructor(scene) {
        this.scene = scene;
        // CheckerBoard Theme
        this.checkerThemer = new CheckerThemer(this.scene);

        // CheckerBoard Visual Representation
        this.checkerBoard = null;

        // Checker animations
        this.checkerAnimator = new CheckerAnimator(this.scene, this);

        // Checkers Logic
        this.checkerLogic = new CheckerLogic(this.scene, this);

        // Checkers move sequence
        this.checkerSequence = new CheckerSequence(this.checkerLogic);
    }

    setCheckerBoard(checkerBoard) { this.checkerBoard = checkerBoard; }

    isPickPiece(pickResult) { return pickResult < 25; }

    movePiece(pieceID, tileName) {
        // Get Tile and Piece
        let piece = this.checkerLogic.getPieceFromID(pieceID);
        let tile = this.checkerLogic.getTileFromName(tileName);
        // Play Animation
        let anim = this.checkerBoard.movePiece(piece, tile);
        // Attach Piece to tile when animation is over
        anim.onAnimationOver(this.checkerLogic.makePlay.bind(this.checkerLogic), piece, tile);
        // Register move
        this.checkerSequence.addMove(tile);
        // Cleanup
        this.checkerLogic.deselectPiece();
    }

    moveWhitePieceOut(piece) {
        let anim = this.checkerBoard.movePiece(piece,
            this.checkerLogic.getNextFreeWhiteAuxTile());

        anim.onAnimationOver(this.checkerLogic.moveWhitePieceOut.bind(this.checkerLogic), piece);
    }

    moveBlackPieceOut(piece) {
        let anim = this.checkerBoard.movePiece(piece,
            this.checkerLogic.getNextFreeBlackAuxTile());

        anim.onAnimationOver(this.checkerLogic.moveBlackPieceOut.bind(this.checkerLogic), piece);

    }

    handlePick(pickResult) {
        if (this.isPickPiece(pickResult))
            this.checkerLogic.selectPiece(pickResult);
        else {
            let tileName = CheckerTile.IDtoName(pickResult);
            this.logTile(tileName);
            if (this.checkerLogic.isMoveValid(tileName))
                this.movePiece(this.checkerLogic.selectedPiece, tileName);
        }
    }

    update(t) {
        this.checkerAnimator.update(t);
    }

    logTile(tileName) { console.log("Selected Tile: " + tileName); }
}
