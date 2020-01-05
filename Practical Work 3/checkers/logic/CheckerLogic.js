class CheckerLogic {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.availableMoves = [];

        this.capturedWhitePieces = 0;
        this.capturedBlackPieces = 0;

        this.playerTurn = 0;
        this.player1 = null;
        this.player2 = null;
        this.activePlayer = null;;

        this.gameType = null;
        this.gameOver = false;
        this.gameStarted = false;
        this.winner = null;

        this.gameClock = new Clock();

        this.turnClock = new Clock();
        this.turnTimerEnabled = false;
        this.maxTurnTime = 0;


        this.turn = 0;
        this.init();
    }

    // PICKING

    switchTurn() {
        ++this.turn;
        this.playerTurn ^= 1;
        this.activePlayer = (this.playerTurn) ? this.player1 : this.player2;
        this.turnClock.reset();
        this.activePlayer.onTurn();
    }

    checkNewKings() {

        for (let i in this.tileRow1) {
            let piece = this.tileRow1[i].piece;
            if (piece)
                if (!piece.king && piece.type == "black")
                    this.checkers.makeKing(piece);
        }

        for (let i in this.tileRow8) {
            let piece = this.tileRow8[i].piece;
            if (piece)
                if (!piece.king && piece.type == "white")
                    this.checkers.makeKing(piece);
        }
    }

    updateMoves(forcedCapture) {
        if (this.playerTurn) {
            for (let i = 12; i < 24; ++i) {
                if (!this.pieces[i].captured)
                    this.pieces[i].availableMoves = this.generatePossibleMoves(i, forcedCapture);
            }
        }
        else {
            for (let i = 0; i < 12; ++i) {
                if (!this.pieces[i].captured)
                    this.pieces[i].availableMoves = this.generatePossibleMoves(i, forcedCapture);
            }
        }
    }

    handlePick(pickResult) { this.activePlayer.handlePick(pickResult); }

    // CAPTURING PIECES

    getFreeAuxTile(type) {
        if (type == "white")
            return this.auxiliarTiles[this.capturedWhitePieces + 12];

        return this.auxiliarTiles[this.capturedBlackPieces];
    }

    getCapturedPiece(type) {
        for (let i in this.pieces) {
            let piece = this.pieces[i];
            if (piece.captured && piece[i].type == type && !piece.onKing)
                return this.pieces[i];
        }
        return null;
    }

    makeKing(piece, sparePiece) {
        piece.makeKing(sparePiece);
        this.updateMoves();
    }

    capturePiece(piece) {
        piece.tile.piece = null;
        piece.tile = null;
        piece.capture();
        // Capture white piece
        this.updateMoves();
        if (piece.type == "white") {
            this.auxiliarTiles[this.capturedWhitePieces + 12].attachPiece(piece);
            ++this.capturedWhitePieces;
            this.winner = this.winConditionsMet();
            if (this.winner)
                this.gameOver = true;
            return;
        }
        // Capture black piece
        this.auxiliarTiles[this.capturedBlackPieces].attachPiece(piece);
        ++this.capturedBlackPieces;
        this.checkNewKings();

        this.winner = this.winConditionsMet();
        if (this.winner)
            this.gameOver = true;
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

    getValidMove(piece, tileName) {
        if (!piece || !tileName)
            return null;

        for (let i in piece.availableMoves)
            if (piece.availableMoves[i].destinationTile.name == tileName)
                return piece.availableMoves[i];

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

        if (piece.king) {
            let topLeftMove = this.generateTopLeftMove(tile, piece);
            if (topLeftMove)
                moves.push(topLeftMove);

            let topRightMove = this.generateTopRightMove(tile, piece);
            if (topRightMove)
                moves.push(topRightMove);
            ;
            let bottomLeftMove = this.generateBottomLeftMove(tile, piece);
            if (bottomLeftMove)
                moves.push(bottomLeftMove);

            let bottomRightMove = this.generateBottomRightMove(tile, piece);
            if (bottomRightMove)
                moves.push(bottomRightMove);

        }
        else {
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
        if (topLeft.piece.type == piece.type || !topLeft.hasTopLeftTile()
            || topLeft.piece.captured)
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
        if (topRight.piece.type == piece.type || !topRight.hasTopRightTile()
            || topRight.piece.captured)
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
        if (bottomLeft.piece.type == piece.type || !bottomLeft.hasBottomLeftTile()
            || bottomLeft.piece.captured)
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
        if (bottomRight.piece.type == piece.type || !bottomRight.hasBottomRightTile()
            || bottomRight.piece.captured)
            return null;

        let bottomRight2 = this.getTileFromName(bottomRight.bottomRight);

        if (!bottomRight2.hasPiece())
            return new CheckerMove(piece, bottomRight2, bottomRight.piece);

        return null;
    }

    // MOVE PIECES

    makePlay(move, animate) {
        let piece = move.piece;
        let tile = move.destinationTile;

        let capture = false;

        if (move.capturedPiece) {
            if (animate)
                this.checkers.capturePiece(move.capturedPiece);
            else this.capturePiece(move.capturedPiece);
            capture = true;
        }
        this.movePiece(piece, tile);

        // Check if game is over
        this.winner = this.winConditionsMet();
        if (this.winner) {
            this.gameOver = true;
            return;
        }

        if (!(move.capturedPiece && this.canPieceCapture(piece))) {
            this.switchTurn();
            if (!capture) {
                this.checkNewKings();
                this.updateMoves(false);
            }
        }
        else this.activePlayer.onJump(move.piece);

        this.turnClock.continue();
    }

    movePiece(piece, tile) { tile.attachPiece(piece); }

    // OTHERS

    winConditionsMet() {
        // If a player has captured all pieces he wins
        if (this.capturedWhitePieces >= 12)
            return "black";

        if (this.capturedBlackPieces >= 12)
            return "white";

        // If a player has no moves left the other player wins
        let noMoves = true, winner = null, i = 0, iStop = 12;
        if (this.playerTurn) {
            winner = "white";
            i = 12;
            iStop = 24;
        }
        else {
            winner = "black";
            i = 0;
            iStop = 12;
        }

        for (; i < iStop; ++i)
            if (this.pieces[i].availableMoves.length)
                noMoves = false;

        if (noMoves)
            return winner;

        return false;
    }

    newGame(type, resetSequence) {
        this.reset(resetSequence);

        this.fillStartBlock("white");
        this.fillStartBlock("black");
        this.gameType = type;
        if (type == "HvH") {
            //this.player1 = new CheckerHuman(this.scene, this.checkers, this, "black");
            //this.player2 = new CheckerHuman(this.scene, this.checkers, this, "white");
            this.player1 = new CheckerMachine(this.scene, this.checkers, this, "black", "easy")
            this.player2 = new CheckerMachine(this.scene, this.checkers, this, "white", "hard");
            this.switchTurn();
            this.updateMoves();
        }
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

        // Arrays with first and last row easy checking of new kings
        this.tileRow1 = [];
        this.tileRow8 = [];
        for (let i in this.tiles) {
            let tilename = this.tiles[i].name;
            if (tilename.charAt(1) == '1' && (tilename.charCodeAt(0) % 2))
                this.tileRow1.push(this.tiles[i]);
            else if (tilename.charAt(1) == '8' && !(tilename.charCodeAt(0) % 2))
                this.tileRow8.push(this.tiles[i]);
        }
    }

    update() {
        this.gameClock.update();
        if (this.activePlayer)
            this.activePlayer.update();
        if (this.turnTimerEnabled) {
            this.turnClock.update();
            if (this.turnClock.timeElapsedSeconds() >= this.maxTurnTime) {
                this.winner = (this.playerTurn) ? "white" : "black";
                this.gameOver = true;
            }
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

    resetTiles() {
        for (let i in this.tiles)
            this.tiles[i].reset();

        for (let i in this.auxiliarTiles)
            this.auxiliarTiles[i].reset();
    }

    resetPieces() {
        for (let i in this.pieces)
            this.pieces[i].reset();
    }


    resetGame() {
        if (this.gameType)
            this.newGame(this.gameType);
    }

    updateTurnTimer() {
        if (this.maxTurnTime) {
            this.turnClock.reset();
            this.turnTimerEnabled = true;
        }
        else this.turnTimerEnabled = false;
    }

    reset(resetSequence) {
        if (resetSequence)
            this.checkers.checkerSequence.reset();

        this.gameClock.reset();
        this.turnClock.reset();
        this.availableMoves = [];
        this.capturedWhitePieces = 0;
        this.capturedBlackPieces = 0;
        this.playerTurn = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.winner = null;
        this.turn = 0;
        this.resetTiles();
        this.resetPieces();
    }

    getPieceFromID(ID) { return this.pieces[ID]; }
    getPieceFromTileName(tileName) { return this.tiles[tileName].piece; }
    getTileFromName(name) { return this.tiles[name]; }
    getTileFromPieceID(piece) { return this.pieces[piece].tile; }
}
