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
        
        // AssetsManager.playSound(CONFIG.SOUNDS.diceRoll); // Play dice roll sound
        return { value: diceValue, endedTurn: false };
    },

    // --- Token Movement ---
    getValidMoves: function(playerId, diceValue) {
        const player = StateManager.getStateByPath(`playerData.${playerId}`);
        if (!player) return [];

        const validMoves = [];

        // 1. Move tokens out of the yard if a 6 is rolled (and yard is not empty)
        if (diceValue === 6 && player.tokensInYard > 0) {
            player.tokens.forEach(token => {
                if (token.pathPosition === -1) { // Token is in yard
                    validMoves.push({ 
                        tokenId: token.id, 
                        tokenIndex: token.index, 
                        type: "move_out_of_yard", 
                        targetPathPosition: player.startTileIndex 
                    });
                }
            });
        }

        // 2. Move tokens already on the board
        player.tokens.forEach(token => {
            if (token.onBoard) {
                let newPathPosition;
                let newHomeStretchPosition = -1;
                let willEnterHomeStretch = false;
                let willReachHome = false;

                if (token.inHomeStretch) {
                    newHomeStretchPosition = token.homeStretchPosition + diceValue;
                    if (newHomeStretchPosition < player.homeStretchTiles) {
                        // Valid move within home stretch
                    } else if (newHomeStretchPosition === player.homeStretchTiles) {
                        willReachHome = true;
                    } else {
                        return; // Overshot home, invalid move
                    }
                } else {
                    // Check if token passes or lands on its home stretch entry
                    let currentPos = token.pathPosition;
                    let stepsTaken = 0;
                    let tempPathPosition = currentPos;

                    for (let i = 0; i < diceValue; i++) {
                        // Handle wrap-around for path calculation
                        tempPathPosition = (tempPathPosition + 1) % CONFIG.PATH_LENGTH;
                        stepsTaken++;
                        if (tempPathPosition === player.homeStretchEntryPathIndex && stepsTaken <= diceValue) {
                            willEnterHomeStretch = true;
                            newHomeStretchPosition = diceValue - stepsTaken;
                            if (newHomeStretchPosition < player.homeStretchTiles) {
                                // Valid move into home stretch
                            } else if (newHomeStretchPosition === player.homeStretchTiles) {
                                willReachHome = true;
                            } else {
                                return; // Overshot home from entry, invalid move
                            }
                            break; // Stop path calculation, move to home stretch
                        }
                    }
                    if (!willEnterHomeStretch) {
                        newPathPosition = (token.pathPosition + diceValue) % CONFIG.PATH_LENGTH;
                    }
                }

                if (willReachHome) {
                    validMoves.push({ 
                        tokenId: token.id, 
                        tokenIndex: token.index, 
                        type: "move_to_home", 
                        targetHomeStretchPosition: player.homeStretchTiles 
                    });
                } else if (willEnterHomeStretch) {
                     validMoves.push({ 
                        tokenId: token.id, 
                        tokenIndex: token.index, 
                        type: "move_into_home_stretch", 
                        targetHomeStretchPosition: newHomeStretchPosition 
                    });
                } else if (token.onBoard && !token.inHomeStretch && newPathPosition !== undefined) {
                    validMoves.push({ 
                        tokenId: token.id, 
                        tokenIndex: token.index, 
                        type: "move_on_path", 
                        targetPathPosition: newPathPosition 
                    });
                } else if (token.inHomeStretch && newHomeStretchPosition !== -1 && newHomeStretchPosition < player.homeStretchTiles) {
                     validMoves.push({ 
                        tokenId: token.id, 
                        tokenIndex: token.index, 
                        type: "move_in_home_stretch", 
                        targetHomeStretchPosition: newHomeStretchPosition 
                    });
                }
            }
        });
        
        // Apply Arrow Tile Bonus if applicable (for Arrow Mode)
        const gameState = StateManager.getState();
        if (gameState.selectedGameMode && gameState.selectedGameMode.includes("arrow")) {
            validMoves.forEach(move => {
                if (move.type === "move_on_path") {
                    const arrowTile = CONFIG.ARROW_TILES.find(tile => tile.index === move.targetPathPosition);
                    if (arrowTile) {
                        move.arrowBonus = arrowTile.bonus;
                        move.finalPathPosition = (move.targetPathPosition + arrowTile.bonus) % CONFIG.PATH_LENGTH;
                        // Note: Need to handle if arrow bonus leads into home stretch or causes capture
                    }
                }
            });
        }

        console.log(`Valid moves for ${playerId} with dice ${diceValue}:`, validMoves);
        return validMoves;
    },

    executeMove: function(playerId, move) {
        const player = StateManager.getStateByPath(`playerData.${playerId}`);
        const tokenToMove = player.tokens[move.tokenIndex];
        let capturedTokenInfo = null;

        // Update token state based on move type
        const oldPathPosition = tokenToMove.pathPosition;
        let newPathPosition = tokenToMove.pathPosition;
        let newHomeStretchPosition = tokenToMove.homeStretchPosition;
        let newOnBoard = tokenToMove.onBoard;
        let newInHomeStretch = tokenToMove.inHomeStretch;
        let newReachedHome = tokenToMove.reachedHome;
        let newTokensInYard = player.tokensInYard;
        let newTokensAtHome = player.tokensAtHome;

        switch (move.type) {
            case "move_out_of_yard":
                newPathPosition = move.targetPathPosition;
                newOnBoard = true;
                newTokensInYard--;
                break;
            case "move_on_path":
                newPathPosition = move.finalPathPosition !== undefined ? move.finalPathPosition : move.targetPathPosition;
                break;
            case "move_into_home_stretch":
                newPathPosition = -1; // No longer on main path
                newInHomeStretch = true;
                newHomeStretchPosition = move.targetHomeStretchPosition;
                break;
            case "move_in_home_stretch":
                newHomeStretchPosition = move.targetHomeStretchPosition;
                break;
            case "move_to_home":
                newPathPosition = -1;
                newInHomeStretch = false;
                newOnBoard = false;
                newReachedHome = true;
                newTokensAtHome++;
                break;
        }

        // Update the moving token first
        StateManager.updateTokenState(playerId, move.tokenIndex, {
            pathPosition: newPathPosition,
            homeStretchPosition: newHomeStretchPosition,
            onBoard: newOnBoard,
            inHomeStretch: newInHomeStretch,
            reachedHome: newReachedHome
        });
        StateManager.updateState({
            [`playerData.${playerId}.tokensInYard`]: newTokensInYard,
            [`playerData.${playerId}.tokensAtHome`]: newTokensAtHome
        });

        // Check for captures if the token landed on the main path and not a safe zone
        if (move.type === "move_on_path" || (move.type === "move_out_of_yard" && newOnBoard)) {
            const landingPosition = newPathPosition;
            if (!CONFIG.SAFE_ZONE_INDICES.includes(landingPosition)) {
                const allPlayersData = StateManager.getStateByPath("playerData");
                const activePlayers = StateManager.getStateByPath("activePlayers");

                activePlayers.forEach(otherPlayerId => {
                    if (otherPlayerId !== playerId) {
                        const otherPlayer = allPlayersData[otherPlayerId];
                        otherPlayer.tokens.forEach((opponentToken, opponentTokenIndex) => {
                            if (opponentToken.onBoard && !opponentToken.inHomeStretch && opponentToken.pathPosition === landingPosition) {
                                // Capture opponent token
                                StateManager.updateTokenState(otherPlayerId, opponentTokenIndex, {
                                    pathPosition: -1,
                                    onBoard: false,
                                    homeYardPosition: allPlayersData[otherPlayerId].tokensInYard // Find next available yard slot
                                });
                                StateManager.updateState({
                                    [`playerData.${otherPlayerId}.tokensInYard`]: allPlayersData[otherPlayerId].tokensInYard + 1
                                });
                                capturedTokenInfo = { playerId: otherPlayerId, tokenIndex: opponentTokenIndex };
                                console.log(`Token ${opponentToken.id} captured by ${tokenToMove.id} at ${landingPosition}`);
                                // AssetsManager.playSound(CONFIG.SOUNDS.tokenCapture);
                            }
                        });
                    }
                });
            }
        }
        
        // AssetsManager.playSound(CONFIG.SOUNDS.tokenMove);
        this.checkWinCondition(playerId);

        // Determine if turn ends or player gets another roll
        const diceValue = StateManager.getStateByPath("diceValue");
        if (diceValue === 6 || capturedTokenInfo || newReachedHome) {
            // Player gets another turn
            StateManager.updateState({ diceRolled: false, turnConsecutiveSixes: 0 }); // Reset for next roll by same player
            console.log("Player gets another turn.");
            return { turnContinues: true, capturedTokenInfo: capturedTokenInfo };
        } else {
            this.endTurn();
            return { turnContinues: false, capturedTokenInfo: capturedTokenInfo };
        }
    },

    // --- Turn Management ---
    startNextTurn: function() {
        const activePlayers = StateManager.getStateByPath("activePlayers");
        let currentPlayerIndex = StateManager.getStateByPath("currentPlayerIndex");
        
        currentPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
        
        StateManager.updateState({
            currentPlayerIndex: currentPlayerIndex,
            diceValue: 0,
            diceRolled: false,
            turnConsecutiveSixes: 0
        });
        console.log(`Next turn: Player ${activePlayers[currentPlayerIndex]}`);
    },

    endTurn: function() {
        console.log("Ending turn for current player.");
        this.startNextTurn();
    },

    // --- Win Condition ---
    checkWinCondition: function(playerId) {
        const player = StateManager.getStateByPath(`playerData.${playerId}`);
        if (player.tokensAtHome === CONFIG.TOKENS_PER_PLAYER) {
            console.log(`Player ${playerId} has won the game!`);
            StateManager.updateState({ currentScreen: "victory", winner: playerId });
            // AssetsManager.playSound(CONFIG.SOUNDS.gameWin);
            UIManager.displayVictoryMessage(player.name);
            return true;
        }
        return false;
    }
};

// Make GameLogic globally accessible (if not using modules)
// window.GameLogic = GameLogic; // Or export default GameLogic; if using modules
