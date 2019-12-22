
class CheckerBoard extends CGFobject {

    constructor(scene, size, checkerLogic) {
        super(scene);
        this.scene = scene;
        this.size = size;
        this.checkerLogic = checkerLogic;
    }

    display() {
        this.scene.logPicking();

        for (let key in this.checkerLogic.tiles)
            this.checkerLogic.tiles[key].display();

        for (let key in this.checkerLogic.tiles)
            this.checkerLogic.tiles[key].displayPiece();

        this.scene.clearPickRegistration();
    }
    // Initializing functions

    initTiles() {
        this.tiles = [];

        const eightSize = this.size / 8.0;
        const halfSize = this.size / 2.0;

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
                let texCoords = [
                    u1, v1,
                    u2, v1,
                    u1, v2,
                    u2, v2
                ]

                let tileName = String.fromCharCode('A'.charCodeAt(0) + (7 - i)) + (8 - j);

                let rect = new MyRectangle(this.scene, null, x1, x2, y1, y2);
                rect.updateTexCoords(texCoords);


                this.checkerLogic.tiles[tileName].setRectangle(rect);
            }
    }

    initPieces() {
        this.WhitePieceModel = this.scene.graph.components["checkerwhitepiece"];
        this.BlackPieceModel = this.scene.graph.components["checkerblackpiece"];
        //this.selectedPieceAnim = this.scene.graph.animations["selectedPieceAnim"];

        this.pieces = [];
        for (let i = 0; i < 12; ++i)
            this.checkerLogic.pieces[i].setModelComponent(this.WhitePieceModel);

        for (let i = 12; i < 24; ++i)
            this.checkerLogic.pieces[i].setModelComponent(this.BlackPieceModel);
    }



    init() {
        this.initTiles();
        this.initPieces();
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
