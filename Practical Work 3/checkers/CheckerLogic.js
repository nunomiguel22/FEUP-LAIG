class CheckerLogic {

    constructor(scene) {
        this.scene = scene;
        this.selectedPiece = null;
        this.availableMoves = [];
        this.init();
    }

    movePieceFromID(piece, tile) {
        if (this.tiles[tile] == null || this.pieces[piece] == null)
            return;

        this.tiles[tile].attachPiece(this.pieces[piece]);
    }

    movePieceFromOBJ(piece, tile) { tile.attachPiece(piece); }

    newGame() {
        this.fillStartBlock("white");
        this.fillStartBlock("black");
    }

    deselectPiece() {
        if (this.selectedPiece != null) {
            for (let i = 0; i < this.availableMoves.length; ++i)
                this.tiles[this.availableMoves[i]].highlight = false;
            this.pieces[this.selectedPiece].deselect();
            this.selectedPiece = null;
        }
    }

    isSamePick(pickResult) { return pickResult - 1 == this.selectedPiece; }

    highlightAvailableMoves() {
        for (let i = 0; i < this.availableMoves.length; ++i)
            this.tiles[this.availableMoves[i]].highlight = true;
    }

    selectPiece(pickResult) {
        if (!this.isSamePick(pickResult)) {
            this.deselectPiece();
            this.selectedPiece = pickResult - 1;
            this.pieces[this.selectedPiece].select();
            this.availableMoves = this.generateAvailableMoves(this.selectedPiece);
            this.highlightAvailableMoves();
        }
    }

    isMoveValid(tileName) {
        if (this.selectedPiece == null || tileName == null)
            return false;

        for (let i = 0; i < this.availableMoves.length; ++i)
            if (this.availableMoves[i] == tileName)
                return true;

        return false;
    }

    generateAvailableMoves(piece) {
        let moves = [];

        let tile = this.getTileFromPiece(piece);
        if (tile.piece.type == "white") {
            if (tile.topLeft != null) {
                let topLeft = this.getTileFromName(tile.topLeft);
                if (topLeft.piece == null)
                    moves.push(topLeft.name);
                else if (topLeft.piece.type == "black" && topLeft.topLeft != null) {
                    let topLeft2 = this.getTileFromName(topLeft.topLeft);
                    if (topLeft2.piece == null)
                        moves.push(topLeft2.name);
                }
            }
            if (tile.topRight != null) {
                let topRight = this.getTileFromName(tile.topRight);
                if (topRight.piece == null)
                    moves.push(topRight.name);
                else if (topRight.piece.type == "black" && topRight.topRight != null) {
                    let topRight2 = this.getTileFromName(topRight.topRight);
                    if (topRight2.piece == null)
                        moves.push(topRight2.name);
                }
            }
        }

        if (tile.piece.type == "black") {
            if (tile.bottomLeft != null) {
                let bottomLeft = this.getTileFromName(tile.bottomLeft);
                if (bottomLeft.piece == null)
                    moves.push(bottomLeft.name);
                else if (bottomLeft.piece.type == "white" && bottomLeft.bottomLeft != null) {
                    let bottomLeft2 = this.getTileFromName(bottomLeft.bottomLeft);
                    if (bottomLeft2.piece == null)
                        moves.push(bottomLeft2.name);
                }
            }
            if (tile.bottomRight != null) {
                let bottomRight = this.getTileFromName(tile.bottomRight);
                if (bottomRight.piece == null)
                    moves.push(bottomRight.name);
                else if (bottomRight.piece.type == "white" && bottomRight.bottomRight != null) {
                    let bottomRight2 = this.getTileFromName(bottomRight.bottomRight);
                    if (bottomRight2.piece == null)
                        moves.push(bottomRight2.name);
                }
            }
        }
        return moves;
    }

    display() {
        this.scene.registerForPick(this.uID, this);
        this.model.display(null, null, null, null);
    }

    init() {
        this.tiles = [];

        let ID = 30;
        for (let j = 0; j < 8; ++j)
            for (let i = 0; i < 8; ++i) {

                let tileName = String.fromCharCode('H'.charCodeAt(0) - (7 - i)) + (j + 1);
                let checkerTile = new CheckerTile(this.scene, tileName, ID++);
                this.tiles[tileName] = checkerTile;
            }

        this.pieces = [];

        for (let i = 0; i < 12; ++i)
            this.pieces.push(new CheckerPiece(this.scene, "white", i + 1));

        for (let i = 0; i < 12; ++i)
            this.pieces.push(new CheckerPiece(this.scene, "black", 13 + i));
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

    getPieceFromID(ID) { return this.pieces[ID]; }
    getPieceFromTileName(tileName) { return this.tiles[tileName].piece; }
    getTileFromName(name) { return this.tiles[name]; }
    getTileFromPiece(piece) { return this.pieces[piece].tile; }
}
