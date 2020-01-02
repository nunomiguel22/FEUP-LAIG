class CheckerHvH extends CheckerMode {

    // 0 - Player on white side
    // 1 - Player on black side

    constructor(scene, checkerLogic) {
        super(scene, checkerLogic);
        this.playerTurn = 1;
    }

    isPickable(ID) {
        if (this.playerTurn)
            return ID >= 12;
        else return ID < 12;
    }

    onTurn() { this.playerTurn ^= 1; }
}
