class StateGame {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.checkerLogic = checkers.checkerLogic;
        this.gameOver = false;

        // Player 1 Information
        this.gameInfo = new UIGameInfo(this.scene, this.checkers);
    }

    handlePick(pickResult) {
        if (this.checkers.isPickPiece(pickResult))
            this.checkers.checkerLogic.selectPiece(pickResult);
        else {
            let tileName = CheckerTile.IDtoName(pickResult);
            this.checkers.logTile(tileName);

            let move = this.checkerLogic.getValidMove(tileName);
            if (move)
                this.checkers.movePiece(move);
        }
    }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.menuState);
    }

    update(t) {
        this.checkers.checkerAnimator.update(t);
        if (this.checkers.checkerLogic.gameOver) {
            this.checkers.changeState(new StateGameOver(this.scene, this.checkers));
        }
    }

    display() {
        this.gameInfo.display();

    }

}
