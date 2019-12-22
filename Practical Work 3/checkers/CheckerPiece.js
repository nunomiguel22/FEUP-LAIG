
class CheckerPiece {

    constructor(scene, type, ID) {
        this.scene = scene;
        this.type = type;
        this.modelComponent = null;
        this.tile = null;
        this.ID = ID;

        this.selected = false;
    }


    setTile(tile) {
        this.tile = tile;
    }

    setModelComponent(modelComponent) { this.modelComponent = modelComponent; }

    select() { this.selected = true; }
    deselect() { this.selected = false; }


    display() {
        this.scene.registerForPick(this.ID, this);
        this.modelComponent.display(null, null, null, null);
    }
}
