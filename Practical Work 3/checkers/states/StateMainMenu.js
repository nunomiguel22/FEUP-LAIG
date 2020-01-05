class StateMainMenu extends State {

    constructor(scene, checkers) {
        super(scene, checkers);
        // Menu
        this.playerTypes = ["Human", "Machine:Easy", "Machine:Hard"];
        this.p1Type = "Human";
        this.p1TypeSel = 0;
        this.p2Type = "Human";
        this.p2TypeSel = 0;
        this.mainMenu = new UIMainMenu(this.scene, this.checkers, this);
    }

    handlePick(pickResult) {
        switch (pickResult) {
            case this.mainMenu.newGameString.ID: {
                this.checkerLogic.newGame(this.p1Type, this.p2Type, true);
                this.checkers.changeState(this.checkers.gameState);
                this.checkerLogic.gameStarted = true;
                break;
            }
            case this.mainMenu.replayString.ID: {
                this.checkers.changeState(new StateReplay(this.scene, this.checkers));
                break;
            }

            case this.mainMenu.p1LArrow.ID: {
                if (this.p1TypeSel == 0)
                    break;
                this.p1Type = this.playerTypes[--this.p1TypeSel];
                break;
            }

            case this.mainMenu.p1RArrow.ID: {
                if (this.p1TypeSel == 2)
                    break;
                this.p1Type = this.playerTypes[++this.p1TypeSel];
                break;
            }

            case this.mainMenu.p2LArrow.ID: {
                if (this.p2TypeSel == 0)
                    break;
                this.p2Type = this.playerTypes[--this.p2TypeSel];
                break;
            }

            case this.mainMenu.p2RArrow.ID: {
                if (this.p2TypeSel == 2)
                    break;
                this.p2Type = this.playerTypes[++this.p2TypeSel];
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
