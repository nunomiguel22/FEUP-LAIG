class StateMainMenu extends State {

    constructor(scene, checkers) {
        super(scene, checkers);
        // Menu
        this.mainMenu = new UIMainMenu(this.scene, this.checkers);
    }

    handlePick(pickResult) {
        switch (pickResult) {
            case this.mainMenu.newGameString.ID: {
                this.checkerLogic.newGame("HvH", true);
                this.checkers.changeState(this.checkers.gameState);
                this.checkerLogic.gameStarted = true;
                break;
            }

            case this.mainMenu.replayString.ID: {
                this.checkers.changeState(new StateReplay(this.scene, this.checkers));
                break;
            }
        }
    }

    update(t) { }

    processKeyDown(event) {
        if (event.code == "Escape" && this.checkers.previousState)
            this.checkers.changeState(this.checkers.previousState);
    }


    display() { this.mainMenu.display(); }
}
