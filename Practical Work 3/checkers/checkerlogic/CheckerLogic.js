class CheckerLogic {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.selectedPiece = null;
        this.availableMoves = [];
        this.nextFreeAuxWhiteTile = 0;
        this.nextFreeAuxBlackTile = 12;
        this.init();
    }

    movePieceFromID(piece, tile) {
        if (this.tiles[tile] == null || this.pieces[piece] == null)
            return;

        this.tiles[tile].attachPiece(this.pieces[piece]);
    }

    movePieceFromOBJ(piece, tile) { tile.attachPiece(piece); }

    makePlay(piece, tile) {
        let tileRange = Math.abs(tile.name.charCodeAt(1) - piece.tile.name.charCodeAt(1));
        if (tileRange > 1) {
            if (piece.type == "white") {
                let topLeft = this.getTileFromName(piece.tile.topLeft);
                if (topLeft != null && topLeft.topLeft == tile.name)
                    this.checkers.moveBlackPieceOut(topLeft.piece);
                else {
                    let topRight = this.getTileFromName(piece.tile.topRight);
                    this.checkers.moveBlackPieceOut(topRight.piece);
                };
            }
            else {
                let bottomLeft = this.getTileFromName(piece.tile.bottomLeft);
                if (bottomLeft != null && bottomLeft.bottomLeft == tile.name)
                    this.checkers.moveWhitePieceOut(bottomLeft.piece);
                else {
                    let bottomRight = this.getTileFromName(piece.tile.bottomRight);
                    this.checkers.moveWhitePieceOut(bottomRight.piece);
                }
            }
        }

        this.movePieceFromOBJ(piece, tile);
        this.gameMode.onTurn();
    }

    getNextFreeWhiteAuxTile() {
        return this.auxiliarTiles[this.nextFreeAuxWhiteTile];
    }
    getNextFreeBlackAuxTile() {
        return this.auxiliarTiles[this.nextFreeAuxBlackTile];
    }

    moveWhitePieceOut(piece) {
        piece.tile.piece = null;
        piece.tile = null;
        this.auxiliarTiles[this.nextFreeAuxWhiteTile++].attachPiece(piece);

    }
    moveBlackPieceOut(piece) {
        piece.tile.piece = null;
        piece.tile = null;
        this.auxiliarTiles[this.nextFreeAuxBlackTile++].attachPiece(piece);
    }

    newGame(type) {
        this.fillStartBlock("white");
        this.fillStartBlock("black");
        if (type == "HvH")
            this.gameMode = new CheckerHvH(this.scene, this);
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

    getPickType(pickResult) {
        return this.pieces[pickResult - 1].type;
    }

    selectPiece(pickResult) {
        let pickID = pickResult - 1;
        if (!this.isSamePick(pickResult) && this.gameMode.isPickable(pickID)) {
            this.deselectPiece();
            this.selectedPiece = pickID;
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

        // Auxiliar tiles for pieces out of play
        this.auxiliarTiles = [];
        for (let i = 0; i < 12; ++i) {
            let tileName = "W" + i;
            this.auxiliarTiles.push(new CheckerTile(this.scene, tileName, null));
        }

        for (let i = 12; i < 24; ++i) {
            let tileName = "B" + i;
            this.auxiliarTiles.push(new CheckerTile(this.scene, tileName, null));
        }
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
