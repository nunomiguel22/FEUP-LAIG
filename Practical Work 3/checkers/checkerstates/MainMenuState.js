class MainMenuState {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        // Menu
        this.mainmenu = new MainMenu(this.scene, this);

    }

    handlePick(pickResult) {
        switch (pickResult) {
            case this.mainmenu.newGameString.ID: {
                this.checkers.checkerLogic.newGame("HvH");
                this.checkers.changeState(this.checkers.gameState);
                break;
            }
        }
    }

    update(t) { this.checkers.checkerAnimator.update(t); }

    processKeyDown(event) {
        if (event.code == "Escape")
            this.checkers.changeState(this.checkers.gameState);
    }


    display() {
        this.scene.pushMatrix();
        this.scene.translate(-40, 100, 0);
        this.scene.scale(30, 30, 30);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.rotate(Math.PI / 4, 0, 1, 0);
        this.mainmenu.display();
        this.scene.popMatrix();
    }
}
