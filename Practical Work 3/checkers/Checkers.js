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
        this.checkerLogic = new CheckerLogic(this.scene);

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
        anim.onAnimationOver(this.checkerLogic.movePieceFromOBJ, piece, tile);
        // Register move
        this.checkerSequence.addMove(tile);
        // Cleanup
        this.checkerLogic.deselectPiece();
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
