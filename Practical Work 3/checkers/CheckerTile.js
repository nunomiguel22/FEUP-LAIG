
class CheckerTile extends MyRectangle {
    constructor(scene, x1, x2, y1, y2, u1, v1, u2, v2) {
        super(scene, null, x1, x2, y1, y2);

        var texCoords = [
            u1, v1,
            u2, v1,
            u1, v2,
            u2, v2
        ]
        this.updateTexCoords(texCoords);
        this.piece = null;
    }

    attachPiece(piece) {
        this.piece = piece;
    }
    detachPiece() {
        this.piece = null;
    }
}
