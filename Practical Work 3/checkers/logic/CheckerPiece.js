class CheckerPiece {

    constructor(scene, type, ID) {
        this.scene = scene;
        this.type = type;
        this.modelComponent = null;
        this.selected = false;
        this.selectAnim = null;
        this.anim = null;
        this.tile = null;
        this.ID = ID;
    }

    setSelectionAnimation(anim) { this.selectAnim = anim; }

    setTile(tile) {
        this.tile = tile;
    }

    select() { this.selected = true; }

    deselect() { this.selected = false; }

    setModelComponent(modelComponent) { this.modelComponent = modelComponent; }

    setAnimation(animation) { this.anim = animation; }

    display() {
        this.scene.registerForPick(this.ID, this);

        if (this.selected)
            this.selectAnim.apply();

        if (this.anim != null) {
            if (this.anim.over)
                this.anim = null;
            else this.anim.apply();
        }

        this.modelComponent.display(null, null, null, null);
    }
}
