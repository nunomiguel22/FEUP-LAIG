
class CheckerTile extends MyRectangle {
    constructor(scene, id, uID, x1, x2, y1, y2, u1, v1, u2, v2) {
        super(scene, null, x1, x2, y1, y2);

        var texCoords = [
            u1, v1,
            u2, v1,
            u1, v2,
            u2, v2
        ]

        this.id = id;
        this.uID = uID;
        const centerdist = (x2 - x1) / 2.0;
        this.centerx = x1 + centerdist;
        this.centery = y1 + centerdist;

        this.updateTexCoords(texCoords);
        this.piece = null;
    }

    attachPiece(piece) {
        if (this.piece != null)
            return;

        if (piece.tile != null)
            piece.tile.detachPiece();

        this.piece = piece;
        this.piece.setTile(this);
    }

    detachPiece() {
        this.piece.setTile(null);
        this.piece = null;
    }

    display() {
        this.scene.registerForPick(this.uID, this);
        super.display();
    }

    displayPiece() {
        this.scene.pushMatrix();
        this.scene.translate(this.centery, this.centerx, 0);

        if (this.piece != null)
            this.piece.display();

        this.scene.popMatrix();
    }
}
