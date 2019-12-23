
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

    select() {
        this.selected = true;
        this.anim = this.selectAnim;
    }

    deselect() {
        this.selected = false;
        if (this.anim != null) {
            this.anim.reset();
            this.anim = null;
        }
    }

    setModelComponent(modelComponent) { this.modelComponent = modelComponent; }

    setAnimation(animation) { this.anim = animation; }

    display() {
        if (this.anim != null) {
            this.anim.apply();
            if (this.anim.over) {
                this.anim.reset();
                this.anim = null;
            }
        }

        this.scene.registerForPick(this.ID, this);
        this.modelComponent.display(null, null, null, null);
    }
}
