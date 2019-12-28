class GameState {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.gameOver = false;

        // Player 1 Information
        this.gameInfo = new GameInfo(this.scene, this.checkers);
    }

    handlePick(pickResult) {
        if (this.checkers.isPickPiece(pickResult))
            this.checkers.checkerLogic.selectPiece(pickResult);
        else {
            let tileName = CheckerTile.IDtoName(pickResult);
            this.checkers.logTile(tileName);
            if (this.checkers.checkerLogic.isMoveValid(tileName)) {
                this.checkers.movePiece(this.checkers.checkerLogic.selectedPiece, tileName);

            }
        }
    }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.menuState);
    }

    update(t) {
        this.checkers.checkerAnimator.update(t);
        if (this.checkers.checkerLogic.gameOver) {
            this.checkers.changeState(new GameOverState(this.scene, this.checkers));
        }
    }

    display() {
        this.gameInfo.display();

    }

}
