/**
 * Replay state class, displays a replay of the previous game
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {checkers} checkers  Reference to checkers object
 */
class StateReplay extends State {

    constructor(scene, checkers) {
        super(scene, checkers);
        this.checkerLogic.newGame(this.checkerLogic.gameType, false);
        this.checkerAnimator = this.checkers.checkerAnimator;
        this.checkerAnimator.reset();
        this.checkerSequence = this.checkers.checkerSequence;
        this.prevTurnTimerEnabled = this.checkerLogic.turnTimerEnabled;
        this.checkerLogic.turnTimerEnabled = false;

        this.gameInfo = new UIGameInfo(this.scene, this.checkers);

        this.moves = [];
    }

    handlePick(pickResult) { }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.menuState);
    }

    undo() { }

    update(t) {
        if (this.checkers.checkerLogic.gameOver) {
            this.checkerSequence.checkerMoves = this.moves;
            this.checkerAnimator.reset();
            this.checkers.changeState(new StateGameOver(this.scene, this.checkers));
            this.checkerLogic.turnTimerEnabled = this.prevTurnTimerEnabled;
            return;
        }
        this.checkerAnimator.update(t);
        if (!this.checkerAnimator.isAnimatingMoves()) {
            let move = this.checkerSequence.popFirstElement();
            if (move) {
                this.checkers.movePiece(move);
                this.moves.push(move);
            }
        }
    }

    display() { this.gameInfo.display(); }

}
