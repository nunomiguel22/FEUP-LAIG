
class CheckerPiece {

    constructor(scene, model, type, uID) {
        this.scene = scene;
        this.type = type;
        this.model = model;
        this.tile = null;
        this.uID = uID;
    }

    setTile(tile) {
        this.tile = tile;
    }

    display() {
        this.scene.registerForPick(this.uID, this);
        this.model.display(null, null, null, null);
    }
}
