
class CheckerTile {
    constructor(scene, name, ID) {

        this.scene = scene;
        this.tileRect = null;

        this.name = name;
        this.ID = ID;

        this.centerx = 0;
        this.centery = 0;
        this.topRight = this.getTopRightTile(this.name);
        this.topLeft = this.getTopLeftTile(this.name);
        this.bottomLeft = this.getBottomLeftTile(this.name);
        this.bottomRight = this.getBottomRightTile(this.name);
        this.highlight = false;

        this.piece = null;
    }

    hasPiece() { return this.piece != null; }
    hasTopLeftTile() { return this.topLeft != null; }
    hasBottomLeftTile() { return this.bottomLeft != null; }
    hasTopRightTile() { return this.topRight != null; }
    hasBottomRightTile() { return this.bottomRight != null; }

    setRectangle(rectangle) {
        this.tileRect = rectangle;
        this.updateCenterPoints();
    }

    updateCenterPoints() {
        const centerdist = (this.tileRect.x2 - this.tileRect.x1) / 2.0;
        this.centerx = this.tileRect.x1 + centerdist;
        this.centery = this.tileRect.y1 + centerdist;
    }

    getTopRightTile(tile) {
        let column = String.fromCharCode(tile.charCodeAt(0) + 1);
        if (column.charCodeAt(0) > 'H'.charCodeAt(0))
            return null;
        let row = String.fromCharCode(tile.charCodeAt(1) + 1);
        if (row > 8)
            return null;
        return column + row;
    }

    getTopLeftTile(tile) {
        let column = String.fromCharCode(tile.charCodeAt(0) - 1);
        if (column.charCodeAt(0) < 'A'.charCodeAt(0))
            return null;
        let row = String.fromCharCode(tile.charCodeAt(1) + 1);
        if (row > 8)
            return null;
        return column + row;
    }

    getBottomLeftTile(tile) {
        let column = String.fromCharCode(tile.charCodeAt(0) - 1);
        if (column.charCodeAt(0) < 'A'.charCodeAt(0))
            return null;
        let row = String.fromCharCode(tile.charCodeAt(1) - 1);
        if (row < 1)
            return null;
        return column + row;
    }

    getBottomRightTile(tile) {
        let column = String.fromCharCode(tile.charCodeAt(0) + 1);
        if (column.charCodeAt(0) > 'H'.charCodeAt(0))
            return null;
        let row = String.fromCharCode(tile.charCodeAt(1) - 1);
        if (row < 1)
            return null;
        return column + row;
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
        this.scene.registerForPick(this.ID, this);

        if (this.highlight)
            this.scene.graph.materials["piecehighlight"].apply();

        this.tileRect.display();

        if (this.highlight)
            this.scene.graph.materials["boardMat"].apply();
    }

    displayPiece() {
        this.scene.pushMatrix();
        this.scene.translate(this.centerx, this.centery, 0);

        if (this.piece != null)
            this.piece.display();

        this.scene.popMatrix();
    }

    static IDtoName(id) {
        let nid = id - 30;

        if (nid > 63)
            return null;

        let row = Math.floor(nid / 8) + 1;
        let column = String.fromCharCode('A'.charCodeAt(0) + (nid % 8));
        return column + row;
    }
}
