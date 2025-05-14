// game_logic.js: Core Ludo game rules and logic

const GameLogic = {
    // --- Dice Rolling ---
    rollDice: function() {
        const diceValue = Utils.getRandomInt(1, 6);
        let consecutiveSixes = StateManager.getStateByPath("turnConsecutiveSixes") || 0;

        if (diceValue === 6) {
            consecutiveSixes++;
        } else {
            consecutiveSixes = 0;
        }

        StateManager.updateState({
            diceValue: diceValue,
            diceRolled: true,
            turnConsecutiveSixes: consecutiveSixes
        });

        console.log(`Dice rolled: ${diceValue}. Consecutive sixes: ${consecutiveSixes}`);

        if (consecutiveSixes === 3) {
            console.log("Rolled three consecutive sixes. Turn forfeited.");
            // AssetsManager.playSound(CONFIG.SOUNDS.turnForfeit); // Add sound if available
            this.endTurn();
            return { value: diceValue, endedTurn: true, reason: "three_sixes" };
        }

        return { value: diceValue, endedTurn: false };
    },

    // --- Token Movement ---
    getPlayableTokens: function(playerIndex, diceValue) {
        const player = StateManager.getStateByPath(`players[${playerIndex}]`);
        if (!player) return [];

        const playableTokens = [];

        player.tokens.forEach((token, tokenIndex) => {
            if (token.state === "home") {
                if (diceValue === 6) {
                    // Can move token out of home if start tile is not blocked by own token (double)
                    const startPos = CONFIG.START_TILE_INDICES[player.color];
                    if (!this.isTileOccupiedByOwnDouble(startPos, playerIndex)) {
                        playableTokens.push({ tokenIndex, type: "move_out" });
                    }
                }
            } else if (token.state === "active") {
                const currentPathPos = token.position;
                const newPathPos = (currentPathPos + diceValue);
                const homeEntryPathIndex = CONFIG.HOME_STRETCH_ENTRY_INDICES[player.color];

                // Check if moving into home stretch
                if (currentPathPos <= homeEntryPathIndex && newPathPos > homeEntryPathIndex) {
                    const stepsIntoHomeStretch = newPathPos - homeEntryPathIndex -1; // -1 because entry is tile 0 of home stretch
                    if (stepsIntoHomeStretch < CONFIG.HOME_STRETCH_LENGTH) {
                         if (!this.isHomeStretchTileOccupiedByOwn(playerIndex, stepsIntoHomeStretch)) {
                            playableTokens.push({ tokenIndex, type: "move_to_home_stretch", newPosition: stepsIntoHomeStretch });
                        }
                    }
                } else if (newPathPos < CONFIG.PATH_LENGTH) { // Standard move on main path
                    if (!this.isTileOccupiedByOwnDouble(newPathPos % CONFIG.PATH_LENGTH, playerIndex)) {
                        playableTokens.push({ tokenIndex, type: "move_on_path", newPosition: newPathPos % CONFIG.PATH_LENGTH });
                    }
                }
            } else if (token.state === "homestretch") {
                const newHomeStretchPos = token.position + diceValue;
                if (newHomeStretchPos < CONFIG.HOME_STRETCH_LENGTH) { // Move within home stretch
                     if (!this.isHomeStretchTileOccupiedByOwn(playerIndex, newHomeStretchPos)) {
                        playableTokens.push({ tokenIndex, type: "move_in_home_stretch", newPosition: newHomeStretchPos });
                    }
                } else if (newHomeStretchPos === CONFIG.HOME_STRETCH_LENGTH) { // Reaches home exactly
                    playableTokens.push({ tokenIndex, type: "move_to_goal" });
                }
            }
        });
        console.log("Playable tokens: ", playableTokens);
        return playableTokens;
    },

    moveToken: function(playerIndex, tokenIndex, moveDetails) {
        const player = StateManager.getStateByPath(`players[${playerIndex}]`);
        const token = player.tokens[tokenIndex];
        let capturedTokenInfo = null;

        switch (moveDetails.type) {
            case "move_out":
                token.position = CONFIG.START_TILE_INDICES[player.color];
                token.state = "active";
                console.log(`Player ${player.color} token ${tokenIndex} moved out to ${token.position}`);
                capturedTokenInfo = this.checkAndHandleCapture(playerIndex, token.position);
                break;
            case "move_on_path":
                token.position = moveDetails.newPosition;
                console.log(`Player ${player.color} token ${tokenIndex} moved on path to ${token.position}`);
                capturedTokenInfo = this.checkAndHandleCapture(playerIndex, token.position);
                break;
            case "move_to_home_stretch":
                token.position = moveDetails.newPosition;
                token.state = "homestretch";
                console.log(`Player ${player.color} token ${tokenIndex} moved to home stretch at ${token.position}`);
                break;
            case "move_in_home_stretch":
                token.position = moveDetails.newPosition;
                console.log(`Player ${player.color} token ${tokenIndex} moved in home stretch to ${token.position}`);
                break;
            case "move_to_goal":
                token.state = "finished";
                token.position = -1; // Or some other indicator for finished
                player.tokensFinished++;
                console.log(`Player ${player.color} token ${tokenIndex} reached goal! Total finished: ${player.tokensFinished}`);
                // AssetsManager.playSound(CONFIG.SOUNDS.tokenHome); // Add sound
                break;
        }
        StateManager.updateStateItem(`players[${playerIndex}].tokens[${tokenIndex}]`, token);
        StateManager.updateStateItem(`players[${playerIndex}].tokensFinished`, player.tokensFinished);

        // Check for win condition
        if (player.tokensFinished === CONFIG.TOKENS_PER_PLAYER) {
            this.endGame(playerIndex);
            return { tokenMoved: true, capturedTokenInfo, gameOver: true, winner: playerIndex };
        }

        // If dice was not 6, end turn. If it was 6, player gets another turn.
        const diceValue = StateManager.getStateByPath("diceValue");
        if (diceValue !== 6) {
            this.endTurn();
            return { tokenMoved: true, capturedTokenInfo, gameOver: false, nextTurn: true };
        }
        
        // Reset dice state for the bonus roll
        StateManager.updateState({ diceRolled: false }); 
        return { tokenMoved: true, capturedTokenInfo, gameOver: false, bonusTurn: true };
    },

    checkAndHandleCapture: function(currentPlayerIndex, targetPathPosition) {
        if (CONFIG.SAFE_ZONE_INDICES.includes(targetPathPosition)) {
            return null; // Cannot capture on a safe zone
        }

        const players = StateManager.getStateByPath("players");
        let capturedDetails = null;

        players.forEach((player, opponentPlayerIndex) => {
            if (opponentPlayerIndex === currentPlayerIndex) return; // Don't capture own tokens

            player.tokens.forEach((token, opponentTokenIndex) => {
                if (token.state === "active" && token.position === targetPathPosition) {
                    // Capture!
                    token.state = "home";
                    token.position = -1;
                    StateManager.updateStateItem(`players[${opponentPlayerIndex}].tokens[${opponentTokenIndex}]`, token);
                    console.log(`Player ${players[currentPlayerIndex].color} captured token ${opponentTokenIndex} of player ${player.color}`);
                    // AssetsManager.playSound(CONFIG.SOUNDS.tokenCapture); // Add sound
                    capturedDetails = { 
                        capturedPlayerIndex: opponentPlayerIndex, 
                        capturedTokenIndex: opponentTokenIndex, 
                        capturedPlayerColor: player.color 
                    };
                    // Note: Standard Ludo usually only allows one token per non-safe tile, so first found is captured.
                    // If multiple opponent tokens could be on the same tile (e.g. due to a bug or variant rule), this would only capture one.
                }
            });
        });
        return capturedDetails;
    },

    isTileOccupiedByOwnDouble: function(pathPosition, playerIndex) {
        const player = StateManager.getStateByPath(`players[${playerIndex}]`);
        let count = 0;
        player.tokens.forEach(token => {
            if (token.state === "active" && token.position === pathPosition) {
                count++;
            }
        });
        return count >= 1; // Simplified: if any own token is there, cannot land (standard Ludo allows forming a block)
                           // For a block, this should be count >= 2, and logic to allow passing if not forming a block.
                           // For now, if any own token is there, consider it blocked for simplicity of not stacking.
                           // If we want to allow stacking own tokens, this should be `return false;`
                           // Or, if we want to prevent moving to a tile if it would form a stack of >2, this needs more logic.
                           // Current simple rule: cannot land on a tile if *any* of your own tokens are already there.
                           // This prevents stacking. If stacking is allowed, this check needs to change.
    },

    isHomeStretchTileOccupiedByOwn: function(playerIndex, homeStretchPos) {
        const player = StateManager.getStateByPath(`players[${playerIndex}]`);
        return player.tokens.some(token => token.state === "homestretch" && token.position === homeStretchPos);
    },

    // --- Turn Management ---
    endTurn: function() {
        let currentPlayerIndex = StateManager.getStateByPath("currentPlayerIndex");
        const numPlayers = StateManager.getStateByPath("players").length;
        currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
        
        StateManager.updateState({
            currentPlayerIndex: currentPlayerIndex,
            diceValue: null,
            diceRolled: false,
            turnConsecutiveSixes: 0,
            // currentSelectedToken: null, // if tracking this
            // availableMoves: [] // if tracking this
        });
        console.log(`Turn ended. Next player: ${StateManager.getStateByPath(`players[${currentPlayerIndex}].color`)} (index ${currentPlayerIndex})`);
        // UIManager.updateTurnIndicator(currentPlayerIndex); // UI should react to state change
    },

    // --- Game Setup & State ---
    initializeGame: function(numPlayers = 2) { // Default to 2 players
        const players = [];
        const playerColors = Object.keys(CONFIG.PLAYER_COLORS).slice(0, numPlayers);

        playerColors.forEach((color, index) => {
            players.push({
                id: `player${index + 1}`,
                color: color,
                name: `Player ${index + 1}`,
                tokens: Array(CONFIG.TOKENS_PER_PLAYER).fill(null).map((_, i) => ({
                    id: i,
                    position: -1, // -1 for home
                    state: "home" // home, active, homestretch, finished
                })),
                tokensFinished: 0,
                isAI: false // Can be set later
            });
        });

        StateManager.resetState(); // Clear any previous state
        StateManager.updateState({
            players: players,
            currentPlayerIndex: 0, // Player 1 (Red) starts
            diceValue: null,
            diceRolled: false,
            turnConsecutiveSixes: 0,
            gamePhase: "playing", // e.g., playing, gameover
            winner: null
        });
        console.log(`Game initialized with ${numPlayers} players. Current player: ${players[0].color}`);
    },

    endGame: function(winnerPlayerIndex) {
        StateManager.updateState({
            gamePhase: "gameover",
            winner: winnerPlayerIndex
        });
        const winnerColor = StateManager.getStateByPath(`players[${winnerPlayerIndex}].color`);
        console.log(`Game Over! Winner is Player ${winnerPlayerIndex + 1} (${winnerColor})`);
        // AssetsManager.playSound(CONFIG.SOUNDS.gameWin); // Add sound
        // UIManager.showGameOverScreen(winnerColor);
    },

    // Utility or helper if needed, e.g. for AI to evaluate moves
    // getPossibleMovesForToken: function(playerIndex, tokenIndex, diceValue) { ... }
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.GameLogic = GameLogic;

