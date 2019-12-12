
class CheckerTile extends MyRectangle {
    constructor(scene, id, x1, x2, y1, y2, u1, v1, u2, v2) {
        super(scene, null, x1, x2, y1, y2);

        var texCoords = [
            u1, v1,
            u2, v1,
            u1, v2,
            u2, v2
        ]

        this.id = id;
        this.centerdist = (x2 - x1) / 2.0;
        this.centerx = x1 + this.centerdist;
        this.centery = y1 + this.centerdist;

        this.updateTexCoords(texCoords);
        this.piece = null;
    }

    attachPiece(piece) {
        this.piece = piece;
        this.piece.setTile(this);
    }
    detachPiece() {
        this.piece = null;
        this.piece.setTile(null);
    }

    displayPiece() {
        this.scene.pushMatrix();
        this.scene.translate(this.centery, this.centerx, 0);

        if (this.piece != null)
            this.piece.display();

        this.scene.popMatrix();
    }
}
