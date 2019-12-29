class Checkers {

    constructor(scene) {
        this.scene = scene;

        // Game Settings
        this.whitePlayerName = "player 1";
        this.blackPlayerName = "player 2";

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

        // State
        this.gameState = new StateGame(this.scene, this);
        this.menuState = new StateMainMenu(this.scene, this);
        this.state = this.menuState;
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

    changeState(state) { this.state = state; }

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

    handlePick(pickResult) { this.state.handlePick(pickResult); }

    update(t) { this.state.update(t); }

    display() { this.state.display(); }

    processKeyDown(event) { this.state.processKeyDown(event); }

    logTile(tileName) { console.log("Selected Tile: " + tileName); }
}
