/**
 * Abstract class representing a state in the game
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {checkers} checkers  Reference to checkers object
 */
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
