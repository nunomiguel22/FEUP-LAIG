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
        this.king = null;
        this.onKing = false;

        this.captured = false;

        this.availableMoves = [];
    }

    setSelectionAnimation(anim) { this.selectAnim = anim; }

    setTile(tile) { this.tile = tile; }

    select() { this.selected = true; }

    deselect() { this.selected = false; }

    setModelComponent(modelComponent) { this.modelComponent = modelComponent; }

    setAnimation(animation) { this.anim = animation; }

    highlightAvailableMoves(highlight) {
        for (let i in this.availableMoves)
            this.availableMoves[i].destinationTile.highlight = highlight;
    }

    makeKing(piece) {
        piece.tile.piece = null;
        piece.tile = null;
        piece.onKing = true;
        this.king = piece;
    }

    capture() {
        this.captured = true;
        this.availableMoves = [];
        this.deselect();
    }

    reset() {
        this.king = null;
        this.captured = false;
        this.availableMoves = [];
        this.deselect();
    }

    display() {
        if (!this.captured)
            this.scene.registerForPick(this.ID, this);

        if (this.selected)
            this.selectAnim.apply();

        if (this.anim != null) {
            if (this.anim.over)
                this.anim = null;
            else this.anim.apply();
        }

        if (this.king) {
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 0.5);
            this.king.display();
            this.scene.popMatrix();
        }

        this.modelComponent.display(null, null, null, null);
    }
}
