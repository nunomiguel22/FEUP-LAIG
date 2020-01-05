/**
 * Game state class, displays game info, updates animations and checkers logic
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {checkers} checkers  Reference to checkers object
 */
class StateGame extends State {

    constructor(scene, checkers) {
        super(scene, checkers);
        this.gameOver = false;

        // Player 1 Information
        this.gameInfo = new UIGameInfo(this.scene, this.checkers);
    }

    handlePick(pickResult) { this.checkerLogic.handlePick(pickResult); }

    processKeyDown(event) {

        if (!this.checkers.checkerAnimator.moveAnimations.length) {
            if (event.code == "Escape")
                this.checkers.changeState(this.checkers.menuState);
            if (event.code == "KeyZ" && event.ctrlKey)
                this.checkers.checkerSequence.undo();
        }

    }

    undo() { this.checkers.checkerSequence.undo(); }

    update(t) {
        this.checkers.checkerAnimator.update(t);
        if (this.checkers.checkerLogic.gameOver) {
            if (this.checkerLogic.winner == "white") {
                ++CheckerPlayer.player2Score;
                this.gameInfo.p2Score.setString(" Score:" + CheckerPlayer.player2Score);
            }
            else {
                ++CheckerPlayer.player1Score;
                this.gameInfo.p1Score.setString(" Score:" + CheckerPlayer.player1Score);
            }
            this.checkers.changeState(new StateGameOver(this.scene, this.checkers));
        }

    }

    display() { this.gameInfo.display(); }

}
