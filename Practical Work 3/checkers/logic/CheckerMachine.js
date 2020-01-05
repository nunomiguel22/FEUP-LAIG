class CheckerMachine extends CheckerPlayer {

    constructor(scene, checkers, checkerLogic, type, difficulty) {
        super(scene, checkers, checkerLogic, type);
        this.pieceIter = 0;
        this.pieceIterStop = 12;
        this.oppPieceIter = 12;
        this.oppPieceIterStop = 24;

        if (type == "black") {
            this.pieceIter = 12;
            this.pieceIterStop = 24;
            this.oppPieceIter = 0;
            this.oppPieceIterStop = 12;
        }

        this.pieces = this.checkerLogic.pieces;

        this.difficulty = difficulty;
        this.makeMove = this.makeMoveEasy;
        if (difficulty == "hard")
            this.makeMove = this.makeMoveHard;


        this.waitClock = new Clock();
        this.turnTaken = false;
    }

    getOpposingCaptureMoves() {
        let capMoves = [];
        for (let i = this.oppPieceIter; i < this.oppPieceIterStop; ++i) {
            let piece = this.pieces[i];
            for (let j in piece.availableMoves) {
                if (piece.availableMoves[j].hasCapture())
                    capMoves.push(piece.availableMoves[j]);
            }
        }
        return capMoves;
    }

    getAvailableCaptureMoves() {
        let capMoves = [];
        for (let i = this.pieceIter; i < this.pieceIterStop; ++i) {
            let piece = this.pieces[i];
            for (let j in piece.availableMoves) {
                if (piece.availableMoves[j].hasCapture())
                    capMoves.push(piece.availableMoves[j]);
            }
        }
        return capMoves;
    }

    getAvailableDefensiveMoves(moves) {
        let defMoves = [];
        let oppCapMoves = this.getOpposingCaptureMoves();
        if (oppCapMoves.length)
            for (let i in oppCapMoves) {
                for (let j in moves) {
                    if (oppCapMoves[i].destinationTile == moves[j].destinationTile)
                        defMoves.push(moves[j]);
                }
            }

        return defMoves;
    }

    getAllAvailableMoves() {
        let moves = [];
        for (let i = this.pieceIter; i < this.pieceIterStop; ++i) {
            for (let j in this.pieces[i].availableMoves)
                moves.push(this.pieces[i].availableMoves[j]);
        }
        return moves;
    }

    getRandomInteger(lowerLimit, upperLimit) {
        return Math.floor(Math.random() * upperLimit) + lowerLimit;
    }

    selectRandomMove(moves) {
        if (moves.length) {
            let iter = this.getRandomInteger(0, moves.length - 1);
            return moves[iter];
        }
        return null;
    }

    makeMoveEasy() {
        let moves = this.getAllAvailableMoves();
        let move = this.selectRandomMove(moves);

        this.checkers.movePiece(move);
    }

    makeMoveHard() {
        let moves = this.getAllAvailableMoves();

        // Defend first if possible
        let defMoves = this.getAvailableDefensiveMoves(moves);
        let randomdefMove = this.selectRandomMove(defMoves);
        if (defMoves.length) {
            this.checkers.movePiece(randomdefMove);
            return;
        }

        // Capture if no pieces are in danger
        let capMoves = this.getAvailableCaptureMoves();
        let randomCapMove = this.selectRandomMove(capMoves);
        if (randomCapMove) {
            this.checkers.movePiece(randomCapMove);
            return;
        }

        // If no defense and capture possible move at random
        this.makeMoveEasy();
    }

    update() {
        this.waitClock.update();

        let waitTime = this.checkerLogic.maxTurnTime ? this.checkerLogic.maxTurnTime / 4 : 2;

        if (this.waitClock.timeElapsedSeconds() >= waitTime && !this.turnTaken) {
            this.checkerLogic.updateMoves();
            this.makeMove();
            this.turnTaken = true;
        }
    }

    onTurn() {
        this.waitClock.reset();
        this.turnTaken = false;
    }

    onJump(piece) {
        this.checkerLogic.updateMoves();
        for (let i in piece.availableMoves)
            if (piece.availableMoves[i].hasCapture()) {
                this.checkers.movePiece(piece.availableMoves[i]);
                return;
            }

    }

    handlePick(pickResult) { }
}
