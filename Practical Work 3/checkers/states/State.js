class State {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.checkerLogic = checkers.checkerLogic;
    }

    handlePick(pickResult) { }

    processKeyDown(event) { }

    undo() { }

    update(t) { }

    display() { }

}
