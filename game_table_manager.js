// game_table_manager.js: Manages the Game Table Screen UI and interactions

const GameTableManager = {
    isInitialized: false,

    init: function() {
        if (this.isInitialized) return;
        this._setupEventListeners();
        console.log("GameTableManager initialized.");
        this.isInitialized = true;
    },

    // Called when entering the game table screen
    activate: function() {
        this.init(); // Ensure initialized
        const gameState = StateManager.getState();
        BoardRenderer.init("game-board-area"); // Re-draw board if needed, or ensure it exists
        TokenRenderer.init();
        TokenRenderer.createPlayerTokens(gameState.playerData);
        DiceRenderer.init("dice-container");
        this.updatePlayerPanels();
        this.updateTurnDisplay();
        DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll());
        console.log("GameTableManager activated. Game ready.");
    },

    _setupEventListeners: function() {
        // Dice Roll Button (already handled by DiceRenderer.setDiceClickable)

        // Token Click Listener (event delegation on the board area)
        const boardArea = Utils.$("game-board-area");
        if (boardArea) {
            boardArea.addEventListener("click", (event) => {
                const clickedElement = event.target;
                // Check if a selectable token was clicked
                if (clickedElement.classList.contains("token") && clickedElement.classList.contains("token-selectable")) {
                    const tokenId = clickedElement.id;
                    const playerId = clickedElement.dataset.playerId;
                    const tokenIndex = parseInt(clickedElement.dataset.tokenIndex, 10);
                    // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                    this.handleTokenSelection(playerId, tokenIndex, tokenId);
                }
            });
        }

        // In-Game Menu Button
        const ingameMenuBtn = Utils.$("ingame-menu-btn");
        if (ingameMenuBtn) {
            ingameMenuBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                // For now, just an alert. Could open a modal with options.
                const confirmLeave = confirm("Game Paused. Do you want to leave the game?");
                if (confirmLeave) {
                    Main.goHome(); // Or a more graceful exit
                }
            });
        }
    },

    handleDiceRoll: function() {
        console.log("Dice roll initiated by player.");
        // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick); // Click sound for button
        DiceRenderer.showRollingAnimation();
        DiceRenderer.setDiceClickable(false, null); // Disable dice during roll/move

        // Simulate a short delay for animation before getting result
        setTimeout(() => {
            const rollResult = GameLogic.rollDice(); // This updates state
            DiceRenderer.updateDiceFace(rollResult.value);
            // AssetsManager.playSound(CONFIG.SOUNDS.diceRoll); // Dice roll sound from GameLogic or here

            if (rollResult.endedTurn) {
                // Turn ended due to three sixes, GameLogic.endTurn() was called
                this.updateTurnDisplay();
                DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll()); // Enable for next player
                return;
            }

            const currentPlayer = StateManager.getCurrentPlayer();
            const validMoves = GameLogic.getValidMoves(currentPlayer.id, rollResult.value);

            if (validMoves.length === 0) {
                console.log("No valid moves for the current player.");
                // AssetsManager.playSound(CONFIG.SOUNDS.noMove); // Optional sound
                GameLogic.endTurn();
                this.updateTurnDisplay();
                DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll()); // Enable for next player
            } else if (validMoves.length === 1 && rollResult.value !== 6 && !this._canMoveOtherTokenIfSix(currentPlayer, rollResult.value)) {
                // Auto-move if only one non-6 move and no other token can be moved out with a 6
                console.log("Auto-executing the only valid move.");
                this.executePlayerMove(currentPlayer.id, validMoves[0]);
            } else {
                // Highlight selectable tokens
                const selectableTokenIds = validMoves.map(move => move.tokenId);
                TokenRenderer.highlightSelectableTokens(selectableTokenIds);
                // Player needs to select a token
            }
        }, 500); // Delay matches dice animation suggestion
    },
    
    _canMoveOtherTokenIfSix: function(player, diceValue) {
        if (diceValue === 6 && player.tokensInYard > 0) {
            // Check if there is any token in yard that can be moved out
            return player.tokens.some(token => token.pathPosition === -1);
        }
        return false;
    },

    handleTokenSelection: function(playerId, tokenIndex, tokenId) {
        TokenRenderer.clearTokenHighlights();
        const diceValue = StateManager.getStateByPath("diceValue");
        const validMoves = GameLogic.getValidMoves(playerId, diceValue);
        
        const selectedMove = validMoves.find(move => move.tokenIndex === tokenIndex);

        if (selectedMove) {
            this.executePlayerMove(playerId, selectedMove);
        } else {
            console.warn("Selected token does not correspond to a valid move. This shouldn\\'t happen if highlighting is correct.");
            // Re-enable dice or re-highlight if error in logic
            DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll()); 
        }
    },

    executePlayerMove: function(playerId, move) {
        const moveResult = GameLogic.executeMove(playerId, move);

        // Update all token positions on the board after move and potential capture
        const allPlayerData = StateManager.getStateByPath("playerData");
        for (const pId in allPlayerData) {
            allPlayerData[pId].tokens.forEach(token => {
                TokenRenderer.updateTokenPosition(token, pId, 
                    allPlayerData[pId].startTileIndex, 
                    allPlayerData[pId].homeStretchEntryPathIndex, 
                    allPlayerData[pId].homeStretchTiles
                );
            });
        }
        
        this.updatePlayerPanels(); // Update scores/tokens at home

        if (StateManager.getStateByPath("winner")) {
            // Game over, UIManager.displayVictoryMessage was called by GameLogic
            DiceRenderer.setDiceClickable(false, null);
            return;
        }

        if (moveResult.turnContinues) {
            DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll()); // Enable for same player
        } else {
            this.updateTurnDisplay();
            DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll()); // Enable for next player
        }
    },

    updateTurnDisplay: function() {
        const currentPlayer = StateManager.getCurrentPlayer();
        if (currentPlayer) {
            console.log(`Current turn: Player ${currentPlayer.name}`);
            // Update UI to indicate current player (e.g., highlight player panel)
            Utils.qsa(".player-panel").forEach(panel => Utils.removeClass(panel, "active-turn"));
            const currentPanel = Utils.$(`player-panel-${currentPlayer.id}`);
            if (currentPanel) Utils.addClass(currentPanel, "active-turn");
        }
    },

    updatePlayerPanels: function() {
        const playerData = StateManager.getStateByPath("playerData");
        const activePlayers = StateManager.getStateByPath("activePlayers");
        const container = Utils.$("player-info-panels-area");
        if (!container) return;
        container.innerHTML = "; // Clear old panels

        activePlayers.forEach(playerId => {
            const player = playerData[playerId];
            const panel = Utils.createElement("div", "player-panel");
            panel.id = `player-panel-${playerId}`;
            panel.style.borderColor = player.colorHex;
            
            const nameEl = Utils.createElement("h4");
            nameEl.textContent = player.name;
            const tokensHomeEl = Utils.createElement("p");
            tokensHomeEl.textContent = `Home: ${player.tokensAtHome}/${CONFIG.TOKENS_PER_PLAYER}`;
            
            panel.appendChild(nameEl);
            panel.appendChild(tokensHomeEl);
            container.appendChild(panel);
        });
        this.updateTurnDisplay(); // Re-apply active turn highlight
    }
};

window.GameTableManager = GameTableManager;
console.log("game_table_manager.js executed. GameTableManager defined on window:", typeof window.GameTableManager, window.GameTableManager);
