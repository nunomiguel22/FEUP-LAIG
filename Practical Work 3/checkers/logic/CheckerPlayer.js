class CheckerPlayer {

    constructor(scene, checkers, checkerLogic, type) {
        this.scene = scene;
        this.checkers = checkers;
        this.checkerLogic = checkerLogic;
        this.type = type;
    }

    onTurn() { }

    onJump(piece) { }

    update() { }

    handlePick(pickResult) { }
}
