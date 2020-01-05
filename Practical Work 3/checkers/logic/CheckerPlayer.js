/**
 * Abstract class representing a checker player, human or machine
 * @constructor
 * @param {scene} scene  Reference to scene
 * @param {checkers} checkers  Reference to checkers object
 * @param {checkerLogic} checkerLogic  Reference to checkers logic object
 * @param {type} type  Playing on "white" or "black" side
 * @param {difficulty} difficulty  Easy or hard difficulty
 */
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
