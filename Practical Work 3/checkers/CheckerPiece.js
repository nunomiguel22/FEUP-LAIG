
class CheckerPiece {

    constructor(scene, model, type) {
        this.scene = scene;
        this.type = type;
        this.model = model;
        this.tile = null;
    }

    setTile(tile) {
        this.tile = tile;
    }

    display() {
        this.model.display(null, null, null, null);
    }
}
