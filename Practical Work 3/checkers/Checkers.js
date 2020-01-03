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

    movePiece(move) {
        // Get Tile and Piece
        let piece = move.piece;
        let tile = move.destinationTile;
        // Play Animation
        let anim = this.checkerBoard.movePiece(piece, tile, 0);
        // Attach Piece to tile when animation is over
        anim.onAnimationOver(this.checkerLogic.makePlay.bind(this.checkerLogic), move);
        // Register move
    }


    makeKing(piece) {
        let capturedPiece = this.checkerLogic.getCapturedPiece(piece.type);
        if (!capturedPiece)
            return;

        let anim = this.checkerBoard.movePiece(capturedPiece, piece.tile, 0.3);
        anim.onAnimationOver(this.checkerLogic.makeKing.bind(this.checkerLogic), piece, capturedPiece);
    }

    changeState(state) { this.state = state; }

    capturePiece(piece) {
        piece.captured = true;

        let anim = this.checkerBoard.movePiece(piece,
            this.checkerLogic.getFreeAuxTile(piece.type), 0);

        anim.onAnimationOver(this.checkerLogic.capturePiece.bind(this.checkerLogic), piece);
    }

    handlePick(pickResult) { this.state.handlePick(pickResult); }

    update(t) { this.state.update(t); }

    display() { this.state.display(); }

    processKeyDown(event) { this.state.processKeyDown(event); }

    logTile(tileName) { console.log("Selected Tile: " + tileName); }
}
