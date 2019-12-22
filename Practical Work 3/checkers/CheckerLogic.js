class CheckerLogic {

    constructor(scene) {
        this.scene = scene;
        this.selectedPiece = null;
        this.availableMoves;
        this.init();
    }

    movePiece(piece, tile) {
        if (this.tiles[tile] == null || this.pieces[piece] == null)
            return;

        this.tiles[tile].attachPiece(this.pieces[piece]);
    }

    newGame() {
        this.fillStartBlock("white");
        this.fillStartBlock("black");
    }

    selectPiece(pickResult) {
        if (this.selectedPiece != null)
            this.pieces[this.selectedPiece].deselect();

        this.selectedPiece = pickResult - 1;
        this.pieces[this.selectedPiece].select();
        this.availableMoves = this.generateAvailableMoves(this.selectedPiece);
    }

    onTileSelection(tileName) {
        if (this.isMoveValid(this.selectedPiece, tileName)) {
            this.movePiece(this.selectedPiece, tileName);
            this.selectedPiece = null;
        }
    }

    isMoveValid(selectedPiece, tileName) {
        if (selectedPiece == null || tileName == null)
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
                let topLeft = this.getTileFromID(tile.topLeft);
                if (topLeft.piece == null)
                    moves.push(topLeft.name);
                else if (topLeft.piece.type == "black" && topLeft.topLeft != null) {
                    let topLeft2 = this.getTileFromID(topLeft.topLeft);
                    if (topLeft2.piece == null)
                        moves.push(topLeft2.name);
                }
            }
            if (tile.topRight != null) {
                let topRight = this.getTileFromID(tile.topRight);
                if (topRight.piece == null)
                    moves.push(topRight.name);
                else if (topRight.piece.type == "black" && topRight.topRight != null) {
                    let topRight2 = this.getTileFromID(topRight.topRight);
                    if (topRight2.piece == null)
                        moves.push(topRight2.name);
                }
            }
        }

        if (tile.piece.type == "black") {
            if (tile.bottomLeft != null) {
                let bottomLeft = this.getTileFromID(tile.bottomLeft);
                if (bottomLeft.piece == null)
                    moves.push(bottomLeft.name);
                else if (bottomLeft.piece.type == "white" && bottomLeft.bottomLeft != null) {
                    let bottomLeft2 = this.getTileFromID(bottomLeft.bottomLeft);
                    if (bottomLeft2.piece == null)
                        moves.push(bottomLeft2.name);
                }
            }
            if (tile.bottomRight != null) {
                let bottomRight = this.getTileFromID(tile.bottomRight);
                if (bottomRight.piece == null)
                    moves.push(bottomRight.name);
                else if (bottomRight.piece.type == "white" && bottomRight.bottomRight != null) {
                    let bottomRight2 = this.getTileFromID(bottomRight.bottomRight);
                    if (bottomRight2.piece == null)
                        moves.push(bottomRight2.name);
                }
            }
        }
        return moves;
    }


    setTile(tile) {
        this.tile = tile;
    }

    select() { this.selected = true; }
    deselect() { this.selected = false; }


    display() {
        this.scene.registerForPick(this.uID, this);
        this.model.display(null, null, null, null);
    }

    init() {
        this.tiles = [];

        let ID = 30;
        for (let i = 0; i < 8; ++i)
            for (let j = 0; j < 8; ++j) {

                let tileName = String.fromCharCode('A'.charCodeAt(0) + (7 - i)) + (8 - j);
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
    getTileFromID(ID) { return this.tiles[ID]; }
    getPieceFromTileName(tileName) { return this.tiles[tileName].piece; }
    getTileFromPiece(piece) { return this.pieces[piece].tile; }
}
