/**
 * Class responsible for displaying on screen the pieces and tiles in checker logic
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {size} size  Size of the checkerboard
 * @param {auxheight} auxheight  Height of auxiliar boards
 * @param {checkers} checkers  Reference to checkers object
 */
class CheckerBoard extends CGFobject {

    constructor(scene, size, auxheight, checkers) {
        super(scene);
        this.scene = scene;
        this.size = size;
        this.checkers = checkers;
        this.auxheight = auxheight;
    }

    display() {
        this.scene.setPickEnabled(!this.checkers.checkerAnimator.moveAnimations.length
            && !this.scene.interface.lookAround);
        this.scene.logPicking();

        for (let key in this.checkers.checkerLogic.tiles)
            this.checkers.checkerLogic.tiles[key].display();

        for (let key in this.checkers.checkerLogic.tiles)
            this.checkers.checkerLogic.tiles[key].displayPiece();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.auxheight);
        for (let i in this.checkers.checkerLogic.auxiliarTiles)
            this.checkers.checkerLogic.auxiliarTiles[i].displayPiece();
        this.scene.popMatrix();
    }

    // Initializing functions
    initTiles() {
        this.tiles = [];

        const eightSize = this.size / 8.0;
        const halfSize = this.size / 2.0;

        for (let j = 0; j < 8; ++j)
            for (let i = 0; i < 8; ++i) {
                let x1 = -halfSize + i * eightSize;
                let x2 = -halfSize + i * eightSize + eightSize;
                let y1 = -halfSize + j * eightSize;
                let y2 = -halfSize + j * eightSize + eightSize;
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

                let tileName = String.fromCharCode('H'.charCodeAt(0) - (7 - i)) + (j + 1);

                let rect = new MyRectangle(this.scene, null, x1, x2, y1, y2);
                rect.updateTexCoords(texCoords);

                this.checkers.checkerLogic.tiles[tileName].setRectangle(rect);
            }
    }

    initAuxBoard() {
        const halfSize = this.size / 2.0;
        const eightSize = this.size / 8.0;

        let auxID = 0;
        for (let j = 0; j < 4; ++j)
            for (let i = 0; i < 3; ++i) {
                let x1 = -halfSize * 2 + i * eightSize;
                let x2 = -halfSize * 2 + i * eightSize + eightSize;
                let y1 = -halfSize + j * eightSize;
                let y2 = -halfSize + j * eightSize + eightSize;
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

                let rect = new MyRectangle(this.scene, null, x1, x2, y1, y2);
                rect.updateTexCoords(texCoords);

                this.checkers.checkerLogic.auxiliarTiles[auxID++].setRectangle(rect);
            }
        for (let j = 0; j < 4; ++j)
            for (let i = 0; i < 3; ++i) {
                let x1 = halfSize * 1.25 + i * eightSize;
                let x2 = halfSize * 1.25 + i * eightSize + eightSize;
                let y1 = j * eightSize;
                let y2 = j * eightSize + eightSize;
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

                let rect = new MyRectangle(this.scene, null, x1, x2, y1, y2);
                rect.updateTexCoords(texCoords);

                this.checkers.checkerLogic.auxiliarTiles[auxID++].setRectangle(rect);
            }

    }

    initPieces() {
        this.WhitePieceModel = this.scene.graph.components["checkerwhitepiece"];
        this.BlackPieceModel = this.scene.graph.components["checkerblackpiece"];
        this.selectedPieceAnim = this.scene.graph.animations["selectedPieceAnim"];
        this.selectedPieceAnim.repeat = true;
        this.checkers.checkerAnimator.setSelectAnimation(this.selectedPieceAnim);

        this.pieces = [];
        for (let i = 0; i < 12; ++i) {
            this.checkers.checkerLogic.pieces[i].setModelComponent(this.WhitePieceModel);
            this.checkers.checkerLogic.pieces[i].setSelectionAnimation(this.selectedPieceAnim);
        }
        for (let i = 12; i < 24; ++i) {
            this.checkers.checkerLogic.pieces[i].setModelComponent(this.BlackPieceModel);
            this.checkers.checkerLogic.pieces[i].setSelectionAnimation(this.selectedPieceAnim);
        }
    }

    movePiece(piece, destination, heightAdjust) {
        let vecx = destination.centerx - piece.tile.centerx;
        let vecy = destination.centery - piece.tile.centery;
        let anim = new KeyframeAnimation(this.scene.graph);
        let key1 = new Keyframe(0.3, vec3.fromValues(0, 0, 3.0), vec3.fromValues(0, 0, 0),
            vec3.fromValues(1, 1, 1));
        anim.addKeyframe(key1);
        let key2 = new Keyframe(1.0, vec3.fromValues(vecx, vecy, 3.0), vec3.fromValues(0, 0, 0),
            vec3.fromValues(1, 1, 1));
        anim.addKeyframe(key2);
        let key3 = new Keyframe(1.3, vec3.fromValues(vecx, vecy, heightAdjust), vec3.fromValues(0, 0, 0),
            vec3.fromValues(1, 1, 1));
        anim.addKeyframe(key3);
        piece.setAnimation(anim);
        this.checkers.checkerAnimator.playMoveAnimation(anim);
        return anim;
    }

    init() {
        //tile hightlight prep   
        this.scene.graph.materials["piecehighlight"].setTexture(this.scene.graph.textures["checkerfloortex"]);

        this.initTiles();
        this.initPieces();
        this.initAuxBoard();
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
