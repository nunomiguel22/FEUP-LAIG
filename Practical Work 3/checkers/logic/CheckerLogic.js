class CheckerLogic {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.selectedPiece = null;
        this.availableMoves = [];

        this.capturedWhitePieces = 0;
        this.capturedBlackPieces = 0;

        this.playerTurn = 1;
        this.lockPicking = false;

        this.gameOver = false;
        this.gameStarted = false;
        this.winner = null;

        this.init();
    }

    // PICKING

    switchTurn() {
        this.playerTurn ^= 1;
        this.unlockSelection();
    }

    isPiecePickable(ID) {
        if (this.lockPicking)
            return false;

        if (this.playerTurn)
            return ID >= 12;
        else return ID < 12;
    }

    selectPiece(pickResult, captureOnly) {
        let pickID = pickResult - 1;
        if (!this.isSamePick(pickResult) && this.isPiecePickable(pickID)) {
            this.deselectPiece();
            this.selectedPiece = pickID;
            this.pieces[this.selectedPiece].select();
            this.availableMoves = this.generatePossibleMoves(this.selectedPiece, captureOnly);
            this.highlightAvailableMoves();
        }
    }

    deselectPiece() {
        if (this.selectedPiece != null) {
            for (let i in this.availableMoves)
                this.availableMoves[i].destinationTile.highlight = false;
            this.pieces[this.selectedPiece].deselect();
            this.selectedPiece = null;
        }
    }

    lockSelection(pieceID) {
        this.selectPiece(pieceID, true);
        this.lockPicking = true;
    }

    unlockSelection() {
        this.deselectPiece();
        this.lockPicking = false;
    }

    isSamePick(pickResult) { return (pickResult - 1) == this.selectedPiece; }

    getPickType(pickResult) {
        return this.pieces[pickResult - 1].type;
    }

    // CAPTURING PIECES

    getFreeAuxTile(type) {
        if (type == "white")
            return this.auxiliarTiles[this.capturedWhitePieces + 12];

        return this.auxiliarTiles[this.capturedBlackPieces];

    }

    capturePiece(piece) {
        piece.tile.piece = null;
        piece.tile = null;
        // Capture white piece
        if (piece.type == "white") {
            this.auxiliarTiles[this.capturedWhitePieces + 12].attachPiece(piece);
            ++this.capturedWhitePieces;
            return;
        }
        // Capture black piece
        this.auxiliarTiles[this.capturedBlackPieces].attachPiece(piece);
        ++this.capturedBlackPieces;
    }

    canPieceCapture(piece) {
        let moves = this.generatePossibleMoves(piece.ID - 1, true);

        for (let i in moves)
            if (moves[i].capturedPiece)
                return true;

        return false;
    }

    whitePiecesRemaining() { return 12 - this.capturedWhitePieces; }
    blackPiecesRemaining() { return 12 - this.capturedBlackPieces; }

    // BOARD MOVES

    highlightAvailableMoves() {
        for (let i in this.availableMoves)
            this.availableMoves[i].destinationTile.highlight = true;
    }



    getValidMove(tileName) {
        if (this.selectedPiece == null || tileName == null)
            return null;

        for (let i = 0; i < this.availableMoves.length; ++i)
            if (this.availableMoves[i].destinationTile.name == tileName)
                return this.availableMoves[i];

        return null;
    }

    filterCaptureMoves(moves) {
        let capMoves = [];
        for (let i in moves) {
            if (moves[i].capturedPiece)
                capMoves.push(moves[i]);
        }

        if (capMoves.length)
            return capMoves;

        return moves;
    }

    generatePossibleMoves(pieceID, captureOnly) {
        let moves = [];

        let tile = this.getTileFromPieceID(pieceID);
        let piece = this.getPieceFromID(pieceID);

        switch (piece.type) {
            case "white": {
                let topLeftMove = this.generateTopLeftMove(tile, piece);
                if (topLeftMove)
                    moves.push(topLeftMove);

                let topRightMove = this.generateTopRightMove(tile, piece);
                if (topRightMove)
                    moves.push(topRightMove);
                break;
            }
            case "black": {
                let bottomLeftMove = this.generateBottomLeftMove(tile, piece);
                if (bottomLeftMove)
                    moves.push(bottomLeftMove);

                let bottomRightMove = this.generateBottomRightMove(tile, piece);
                if (bottomRightMove)
                    moves.push(bottomRightMove);
                break;
            }
            default: break;
        }

        if (captureOnly)
            moves = this.filterCaptureMoves(moves);

        return moves;
    }

    generateTopLeftMove(tile, piece) {
        // Top left out of bounds
        if (!tile.hasTopLeftTile())
            return null;

        let topLeft = this.getTileFromName(tile.topLeft);
        // Top left is empty
        if (!topLeft.hasPiece())
            return new CheckerMove(piece, topLeft, null);

        /*  If top left piece is of the same type or next top left is out of bounds 
           jump is impossible  */
        if (topLeft.piece.type == piece.type || !topLeft.hasTopLeftTile())
            return null;

        let topLeft2 = this.getTileFromName(topLeft.topLeft);

        if (!topLeft2.hasPiece())
            return new CheckerMove(piece, topLeft2, topLeft.piece);

        return null;
    }

    generateTopRightMove(tile, piece) {
        // Top left out of bounds
        if (!tile.hasTopRightTile())
            return null;

        let topRight = this.getTileFromName(tile.topRight);
        // Top left is empty
        if (!topRight.hasPiece())
            return new CheckerMove(piece, topRight, null);

        /*  If top left piece is of the same type or next top left is out of bounds 
               jump is impossible  */
        if (topRight.piece.type == piece.type || !topRight.hasTopRightTile())
            return null;

        let topRight2 = this.getTileFromName(topRight.topRight);

        if (!topRight2.hasPiece())
            return new CheckerMove(piece, topRight2, topRight.piece);

        return null;
    }

    generateBottomLeftMove(tile, piece) {
        // Top left out of bounds
        if (!tile.hasBottomLeftTile())
            return null;

        let bottomLeft = this.getTileFromName(tile.bottomLeft);
        // Top left is empty
        if (!bottomLeft.hasPiece())
            return new CheckerMove(piece, bottomLeft, null);
        /*  If top left piece is of the same type or next top left is out of bounds 
           jump is impossible  */
        if (bottomLeft.piece.type == piece.type || !bottomLeft.hasBottomLeftTile())
            return null;

        let bottomLeft2 = this.getTileFromName(bottomLeft.bottomLeft);

        if (!bottomLeft2.hasPiece())
            return new CheckerMove(piece, bottomLeft2, bottomLeft.piece);

        return null;
    }

    generateBottomRightMove(tile, piece) {
        // Top left out of bounds
        if (!tile.hasBottomRightTile())
            return null;

        let bottomRight = this.getTileFromName(tile.bottomRight);
        // Top left is empty
        if (!bottomRight.hasPiece())
            return new CheckerMove(piece, bottomRight, null);
        /*  If top left piece is of the same type or next top left is out of bounds 
           jump is impossible  */
        if (bottomRight.piece.type == piece.type || !bottomRight.hasBottomRightTile())
            return null;

        let bottomRight2 = this.getTileFromName(bottomRight.bottomRight);

        if (!bottomRight2.hasPiece())
            return new CheckerMove(piece, bottomRight2, bottomRight.piece);

        return null;
    }

    // MOVE PIECES

    makePlay(move) {
        let piece = move.piece;
        let tile = move.destinationTile;

        let tileRange = Math.abs(tile.name.charCodeAt(1) - piece.tile.name.charCodeAt(1));
        if (tileRange > 1)
            this.checkers.capturePiece(move.capturedPiece);

        this.movePieceFromOBJ(piece, tile);

        // Check if game is over
        this.winner = this.winConditionsMet();
        if (this.winner) {
            this.gameOver = true;
            return;
        }

        if (!(move.capturedPiece && this.canPieceCapture(piece)))
            this.switchTurn();
        else this.lockSelection(move.piece.ID);
    }


    movePieceFromID(piece, tile) {
        if (this.tiles[tile] == null || this.pieces[piece] == null)
            return;

        this.tiles[tile].attachPiece(this.pieces[piece]);
    }

    movePieceFromOBJ(piece, tile) { tile.attachPiece(piece); }

    // OTHERS

    winConditionsMet() {
        if (this.capturedWhitePieces >= 12)
            return "black";

        if (this.capturedBlackPieces >= 12)
            return "white";

        return false;
    }

    newGame(type) {
        this.fillStartBlock("white");
        this.fillStartBlock("black");
        if (type == "HvH")
            this.gameMode = new CheckerHvH(this.scene, this);
    }

    endGame() {
        for (let i in this.tiles)
            this.tiles[i].detatchPiece();

        for (let i in this.auxiliarTiles)
            this.auxiliarTiles[i].detatchPiece();

        this.gameMode = null;

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
    getTileFromPieceID(piece) { return this.pieces[piece].tile; }
}
