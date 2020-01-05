/**
 * Class manages all facets of the game, logic, animations, etc
 * @constructor
 * @param {scene} scene  Reference to the scene
 */
class Checkers {

    constructor(scene) {
        this.scene = scene;

        // Game Settings
        this.blackPlayerName = "player 1";
        this.whitePlayerName = "player 2";

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
        this.previousState = null;
        this.resetScore();
    }

    setCheckerBoard(checkerBoard) { this.checkerBoard = checkerBoard; }

    movePiece(move) {
        // Stop the turn timer from running during animations
        this.checkerLogic.turnClock.stop();
        // Get Tile and Piece
        let piece = move.piece;
        let tile = move.destinationTile;
        // Play Animation
        let anim = this.checkerBoard.movePiece(piece, tile, 0);
        // Attach Piece to tile when animation is over
        anim.onAnimationOver(this.checkerLogic.makePlay.bind(this.checkerLogic), move, true);
        // Register move
        if (this.state == this.gameState)
            this.checkerSequence.addMove(move);
    }

    undo() { this.state.undo(); }

    resetScore() {
        CheckerPlayer.player1Score = 0;
        CheckerPlayer.player2Score = 0;
        this.gameState.gameInfo.p1Score.setString(" Score:" + CheckerPlayer.player1Score);
        this.gameState.gameInfo.p2Score.setString(" Score:" + CheckerPlayer.player2Score);
    }

    makeKing(piece) {
        let capturedPiece = this.checkerLogic.getCapturedPiece(piece.type);
        if (!capturedPiece)
            return;

        let anim = this.checkerBoard.movePiece(capturedPiece, piece.tile, 0.3);
        anim.onAnimationOver(this.checkerLogic.makeKing.bind(this.checkerLogic), piece, capturedPiece);
    }

    changeState(state) {
        this.previousState = this.state;
        this.state = state;
    }

    capturePiece(piece) {
        piece.captured = true;

        let anim = this.checkerBoard.movePiece(piece,
            this.checkerLogic.getFreeAuxTile(piece.type), 0);

        anim.onAnimationOver(this.checkerLogic.capturePiece.bind(this.checkerLogic), piece);
    }

    handlePick(pickResult) { this.state.handlePick(pickResult); }

    update(t) {
        this.checkerLogic.update();
        this.state.update(t);
    }

    display() { this.state.display(); }

    processKeyDown(event) { this.state.processKeyDown(event); }

    logTile(tileName) { console.log("Selected Tile: " + tileName); }
    logPiece(pieceID) { console.log("Selected Piece: " + pieceID); }
}
