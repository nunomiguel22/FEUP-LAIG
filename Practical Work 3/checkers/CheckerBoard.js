
class CheckerBoard extends CGFobject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

    }

    display() {
        this.scene.logPicking();
        for (let key in this.tiles) {
            this.tiles[key].display();
        }

        for (let key in this.tiles) {
            this.tiles[key].displayPiece();
        }
        this.scene.clearPickRegistration();
    }

    movePiece(piece, tile) {
        if (this.tiles[tile] == null || this.pieces[piece] == null)
            return;

        this.tiles[tile].attachPiece(this.pieces[piece]);
    }

    getPiece(uID) { return this.pieces[uID]; }
    getTile(ID) { return this.tiles[ID]; }
    getPieceFromTile(tile) { return this.tiles[tile].piece; }
    getTileFromPiece(piece) { return this.pieces[piece].tile; }

    tileUIDtoID(uid) {
        let nid = uid - 30;

        if (nid > 63)
            return null;

        let row = Math.floor(nid / 8) + 1;
        let column = String.fromCharCode('A'.charCodeAt(0) + (nid % 8));
        return column + row;
    }

    // Initializing functions

    initTiles() {
        this.tiles = [];
        const size = 43.0;
        const eightSize = size / 8.0;
        const halfSize = size / 2.0;

        let uID = 30;
        for (let i = 0; i < 8; ++i)
            for (let j = 0; j < 8; ++j) {
                let x1 = -halfSize + i * eightSize;
                let x2 = -halfSize + i * eightSize + eightSize;
                let y1 = halfSize - j * eightSize - eightSize;
                let y2 = halfSize - j * eightSize;
                let u1 = 0.125 * i;
                let v1 = 0.125 * j;
                let u2 = 0.125 * i + 0.125;
                let v2 = 0.125 * j + 0.125;

                let tileName = String.fromCharCode('A'.charCodeAt(0) + (7 - i)) + (8 - j);
                let checkerTile = new CheckerTile(this.scene, tileName, uID++, x1, x2, y1, y2, u1,
                    v1, u2, v2);

                this.tiles[tileName] = checkerTile;
            }
    }

    initPieces() {
        this.WhitePieceModel = this.scene.graph.components["checkerwhitepiece"];
        this.BlackPieceModel = this.scene.graph.components["checkerblackpiece"];

        this.pieces = [];
        for (let i = 0; i < 12; ++i)
            this.pieces.push(new CheckerPiece(this.scene, this.WhitePieceModel, "white", i + 1));

        for (let i = 0; i < 12; ++i)
            this.pieces.push(new CheckerPiece(this.scene, this.BlackPieceModel, "black", 13 + i));
    }

    fillStartBlock(type) {
        let j = 1;
        let pieceNumber = 0;

        if (type == "black") {
            pieceNumber = 12;
            j = 6;
        }

        const jstop = j + 3;
        for (; j < jstop; ++j)
            for (let i = 0; i < 8; i += 2) {
                let startCollumn;
                if (j % 2 == 0)
                    startCollumn = 'B';
                else startCollumn = 'A';

                let tileName = String.fromCharCode(startCollumn.charCodeAt(0) + i) + j;
                this.tiles[tileName].attachPiece(this.pieces[pieceNumber++]);
            }
    }

    initStartTable() {
        this.fillStartBlock("white");
        this.fillStartBlock("black");
    }

    init() {
        this.initTiles();
        this.initPieces();
        this.initStartTable();
    }

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        for (let i = 0; i < this.tiles.length; ++i)
            this.tiles[i].updateTexCoords(coords);
    }
	/**
	 * @method amplifyTexCoords
	 * Amplify the list of texture coordinates by an S and T factor
	 * @param length_s - S amplification factor
	 * @param length_t - T amplification factor
	 */
    amplifyTexCoords(length_s, length_t) {
        for (let i = 0; i < this.tiles.length; ++i)
            this.tiles[i].amplifyTexCoords(length_s, length_t);
    }
	/**
	 * @method updateTexCoords
	 * Resets the list of texture coordinates to the initial values
	 */
    resetTexCoords() {
        for (let i = 0; i < this.tiles.length; ++i)
            this.tiles[i].resetTexCoords();
    }
}
