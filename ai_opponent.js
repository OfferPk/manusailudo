// ai_opponent.js: Handles AI player decision-making

const AIOpponent = {
    difficultyLevel: "easy", // Possible values: "easy", "medium", "hard"

    init: function(difficulty = "easy") {
        this.difficultyLevel = difficulty;
        console.log(`AIOpponent initialized with difficulty: ${this.difficultyLevel}`);
    },

    /**
     * Determines the best move for the AI player.
     * @param {string} playerId - The ID of the AI player (e.g., "green").
     * @param {number} diceValue - The current dice roll value.
     * @param {Array} playableMoves - An array of possible moves for the AI player.
     * Each move object: { tokenIndex: number, targetPosition: number, moveType: string (e.g., "normal", "home", "capture") }
     * @param {Object} gameState - The current state of the game (from StateManager.getState()).
     * @returns {Object|null} The chosen move object from playableMoves, or null if no move is chosen.
     */
    chooseMove: function(playerId, diceValue, playableMoves, gameState) {
        if (!playableMoves || playableMoves.length === 0) {
            return null; // No moves available
        }

        console.log(`AI (${playerId}) choosing move. Difficulty: ${this.difficultyLevel}, Dice: ${diceValue}, Moves:`, playableMoves);

        // Strategy depends on difficulty
        switch (this.difficultyLevel) {
            case "easy":
                return this._easyStrategy(playableMoves, playerId, gameState);
            case "medium":
                return this._mediumStrategy(playableMoves, playerId, gameState, diceValue);
            case "hard":
                return this._hardStrategy(playableMoves, playerId, gameState, diceValue);
            default:
                return playableMoves[0]; // Default to the first available move
        }
    },

    _easyStrategy: function(playableMoves, playerId, gameState) {
        // Easy strategy: pick the first valid move, prioritize getting out of home.
        const getOutOfHomeMove = playableMoves.find(move => {
            const token = gameState.players.find(p => p.color === playerId).tokens[move.tokenIndex];
            return token.state === "home";
        });
        if (getOutOfHomeMove) return getOutOfHomeMove;

        return playableMoves[Utils.getRandomInt(0, playableMoves.length - 1)]; // Pick a random move
    },

    _mediumStrategy: function(playableMoves, playerId, gameState, diceValue) {
        // Medium strategy: prioritize captures, then getting out, then moving forward, avoid unsafe spots if possible.
        let bestMove = null;

        // 1. Prioritize capture moves
        const captureMoves = playableMoves.filter(move => this._isCaptureMove(move, playerId, gameState));
        if (captureMoves.length > 0) {
            // Among capture moves, pick one that doesn_t land AI on an opponent_s start tile if possible
            bestMove = captureMoves.find(m => !this._isOpponentStartTile(m.targetPosition, playerId, gameState));
            if (bestMove) return bestMove;
            return captureMoves[0]; // Or just the first capture move
        }

        // 2. Prioritize getting a token out of home
        const getOutOfHomeMoves = playableMoves.filter(move => {
            const token = gameState.players.find(p => p.color === playerId).tokens[move.tokenIndex];
            return token.state === "home";
        });
        if (getOutOfHomeMoves.length > 0) return getOutOfHomeMoves[0];

        // 3. Prioritize moves that land on a safe spot or own color
        const safeMoves = playableMoves.filter(move => 
            CONFIG.SAFE_ZONES.includes(move.targetPosition) || 
            this._isTileOccupiedByOwnColor(move.targetPosition, playerId, gameState)
        );
        if (safeMoves.length > 0) {
            // Prefer moving tokens that are further ahead
            safeMoves.sort((a, b) => {
                const tokenA = gameState.players.find(p => p.color === playerId).tokens[a.tokenIndex];
                const tokenB = gameState.players.find(p => p.color === playerId).tokens[b.tokenIndex];
                return this._getTokenProgress(tokenB, playerId, gameState) - this._getTokenProgress(tokenA, playerId, gameState);
            });
            return safeMoves[0];
        }
        
        // 4. Otherwise, pick a move that moves the furthest token, or just a random one
        playableMoves.sort((a, b) => {
            const tokenA = gameState.players.find(p => p.color === playerId).tokens[a.tokenIndex];
            const tokenB = gameState.players.find(p => p.color === playerId).tokens[b.tokenIndex];
            return this._getTokenProgress(tokenB, playerId, gameState) - this._getTokenProgress(tokenA, playerId, gameState);
        });
        return playableMoves[0];
    },

    _hardStrategy: function(playableMoves, playerId, gameState, diceValue) {
        // Hard strategy: More advanced evaluation of moves
        // - Consider safety, capture potential, blocking opponents, advancing towards home.
        // - Look ahead (minimax or simpler evaluation function).
        // This is a placeholder for a more complex implementation.
        return this._mediumStrategy(playableMoves, playerId, gameState, diceValue); // Fallback to medium for now
    },

    // Helper function to check if a move results in a capture
    _isCaptureMove: function(move, playerId, gameState) {
        if (move.targetPosition < 0 || move.targetPosition >= CONFIG.PATH_LENGTH) return false; // Not on main path
        if (CONFIG.SAFE_ZONES.includes(move.targetPosition)) return false; // Cannot capture on safe zones

        for (const player of gameState.players) {
            if (player.color === playerId) continue; // Skip own tokens
            for (const token of player.tokens) {
                if (token.state === "active" && token.position === move.targetPosition) {
                    return true; // Found an opponent token at the target position
                }
            }
        }
        return false;
    },
    
    _isOpponentStartTile: function(position, aiPlayerId, gameState) {
        for (const player of gameState.players) {
            if (player.color !== aiPlayerId && player.startTile === position) {
                return true;
            }
        }
        return false;
    },

    _isTileOccupiedByOwnColor: function(position, playerId, gameState) {
        const player = gameState.players.find(p => p.color === playerId);
        for (const token of player.tokens) {
            if (token.state === "active" && token.position === position) {
                return true;
            }
        }
        return false;
    },

    _getTokenProgress: function(token, playerId, gameState) {
        if (token.state === "finished") return CONFIG.PATH_LENGTH + CONFIG.HOME_STRETCH_LENGTH + 100; // Arbitrary high value
        if (token.state === "homestretch") return CONFIG.PATH_LENGTH + token.position;
        if (token.state === "active") {
            const playerStartTile = gameState.players.find(p => p.color === playerId).startTile;
            // Calculate distance from player_s specific starting point on the main path
            if (token.position >= playerStartTile) {
                return token.position - playerStartTile;
            } else {
                // Wrapped around
                return CONFIG.PATH_LENGTH - playerStartTile + token.position;
            }
        }
        if (token.state === "home") return -1; // Least progress
        return 0;
    }

    // More helper functions for AI strategies can be added here
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.AIOpponent = AIOpponent;

