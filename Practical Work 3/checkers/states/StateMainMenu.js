class StateMainMenu {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        // Menu
        this.mainMenu = new UIMainMenu(this.scene, this);
    }

    handlePick(pickResult) {
        switch (pickResult) {
            case this.mainMenu.newGameString.ID: {
                this.checkers.checkerLogic.newGame("HvH");
                this.checkers.changeState(this.checkers.gameState);
                this.checkers.checkerLogic.gameStarted = true;
                break;
            }
        }
    }

    update(t) { this.checkers.checkerAnimator.update(t); }

    processKeyDown(event) {
        if (event.code == "Escape" && this.checkers.checkerLogic.gameStarted)
            this.checkers.changeState(this.checkers.gameState);
    }


    display() { this.mainMenu.display(); }
}
