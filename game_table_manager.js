// game_table_manager.js: Manages the Game Table Screen UI and interactions

const GameTableManager = {
    isInitialized: false,

    init: function() {
        if (this.isInitialized) return;
        // Event listeners specific to the game table screen might be set up here
        // or in activate, if they need to be re-bound each time the screen is shown.
        // For now, assuming persistent listeners or listeners managed by UIManager.
        this._setupEventListeners();
        console.log("GameTableManager initialized.");
        this.isInitialized = true;
    },

    // Called when entering the game table screen
    activate: function() {
        this.init(); // Ensure initialized
        const gameState = StateManager.getState();

        // Initialize or re-initialize renderers for the current game state
        BoardRenderer.init("game-board-area"); // Renders the board structure
        TokenRenderer.init("game-board-area"); // Container for tokens, usually same as board
        DiceRenderer.init("dice-image", "roll-dice-btn"); // Dice image and roll button

        // Render initial game elements based on state
        TokenRenderer.createPlayerTokens(gameState.players); // Places tokens in home initially
        this.updatePlayerPanels(); // Display player names, scores, etc.
        this.updateTurnDisplay(); // Highlight current player

        // Set up dice roll functionality
        DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll());
        
        console.log("GameTableManager activated. Game ready.");
        // UIManager.showScreen("game-table-screen"); // This would be handled by UIManager
    },

    _setupEventListeners: function() {
        // Dice Roll Button (already handled by DiceRenderer.setDiceClickable)

        // Token Click/Selection Listener (event delegation on the board area)
        const boardArea = document.getElementById("game-board-area");
        if (boardArea) {
            boardArea.addEventListener("click", (event) => {
                const clickedElement = event.target;
                // Check if a token was clicked
                if (clickedElement.classList.contains("token")) {
                    const tokenIndex = parseInt(clickedElement.dataset.tokenIndex);
                    const playerColor = clickedElement.dataset.playerColor;
                    const currentPlayer = StateManager.getStateByPath(`players[${StateManager.getStateByPath("currentPlayerIndex")}]`);
                    
                    if (playerColor === currentPlayer.color) {
                        this.handleTokenSelection(tokenIndex);
                    }
                }
            });
        }

        // Game Menu Button
        const gameMenuBtn = document.getElementById("game-menu-btn");
        if (gameMenuBtn) {
            gameMenuBtn.addEventListener("click", () => {
                UIManager.showGameMenu(); // Or UIManager.toggleModal("game-menu-modal");
            });
        }
    },

    handleDiceRoll: function() {
        console.log("Handling dice roll...");
        // AssetsManager.playSound(CONFIG.SOUNDS.diceRoll);
        const rollResult = GameLogic.rollDice(); // GameLogic updates state with diceValue
        DiceRenderer.updateDiceFace(rollResult.value); // Show the final dice face

        if (rollResult.endedTurn) {
            // Turn was forfeited (e.g., 3 sixes)
            this.updateTurnDisplay();
            DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll()); // Enable for next player
            return;
        }

        const currentPlayerIndex = StateManager.getStateByPath("currentPlayerIndex");
        const playableTokens = GameLogic.getPlayableTokens(currentPlayerIndex, rollResult.value);

        if (playableTokens.length === 0) {
            console.log("No playable moves for this roll.");
            // AssetsManager.playSound(CONFIG.SOUNDS.noMove); // Optional sound
            if (rollResult.value !== 6) { // If not a 6, and no moves, end turn
                GameLogic.endTurn();
                this.updateTurnDisplay();
                DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll()); // Enable for next player
            } else {
                 // Rolled a 6 but no moves (e.g. all tokens blocked in a specific way)
                 // Player gets another roll
                DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll());
                UIManager.showNotification("Rolled a 6! Roll again.");
            }
            return;
        }

        // If only one playable token, auto-move it (optional, for faster gameplay)
        // if (playableTokens.length === 1) {
        //    this.handleTokenSelection(playableTokens[0].tokenIndex, playableTokens[0]);
        // } else {
            // Highlight playable tokens for player to choose
            TokenRenderer.highlightPlayableTokens(playableTokens, currentPlayerIndex);
            StateManager.updateState({ awaitingTokenSelection: true, availableMoves: playableTokens });
            UIManager.showNotification("Select a token to move.");
        // }
        DiceRenderer.setDiceClickable(false, null); // Disable dice roll until token is moved
    },

    handleTokenSelection: function(tokenIndex, moveData = null) {
        const awaitingSelection = StateManager.getStateByPath("awaitingTokenSelection");
        if (!awaitingSelection && !moveData) return; // Not expecting a selection or no auto-move data

        const currentPlayerIndex = StateManager.getStateByPath("currentPlayerIndex");
        let selectedMove;

        if (moveData) { // Auto-move scenario
            selectedMove = moveData;
        } else { // Manual selection by click
            const availableMoves = StateManager.getStateByPath("availableMoves");
            selectedMove = availableMoves.find(move => move.tokenIndex === tokenIndex);
        }

        if (!selectedMove) {
            console.warn("Selected token is not a valid move.");
            return;
        }

        StateManager.updateState({ awaitingTokenSelection: false, availableMoves: [] });
        TokenRenderer.clearAllHighlights(); // Clear highlights after selection

        const moveResult = GameLogic.moveToken(currentPlayerIndex, selectedMove.tokenIndex, selectedMove);
        
        // Animate token movement
        TokenRenderer.moveToken(currentPlayerIndex, selectedMove.tokenIndex, GameLogic.getPlayerTokenData(currentPlayerIndex, selectedMove.tokenIndex), () => {
            // After animation completes:
            if (moveResult.capturedTokenInfo) {
                UIManager.showCaptureNotification(moveResult.capturedTokenInfo);
                TokenRenderer.sendTokenHome(moveResult.capturedTokenInfo.capturedPlayerIndex, moveResult.capturedTokenInfo.capturedTokenIndex);
            }

            if (moveResult.gameOver) {
                this.handleGameOver(moveResult.winner);
                return;
            }

            if (moveResult.nextTurn) {
                this.updateTurnDisplay();
                DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll());
            } else if (moveResult.bonusTurn) {
                UIManager.showNotification("Rolled a 6! Roll again.");
                DiceRenderer.setDiceClickable(true, () => this.handleDiceRoll());
            }
            this.updatePlayerPanels(); // Update token counts etc.
        });
    },

    updatePlayerPanels: function() {
        const players = StateManager.getStateByPath("players");
        // Example: document.getElementById("player1-info").textContent = `${players[0].name} - Tokens Home: ...`;
        // This needs to be fleshed out based on actual HTML structure for player info display
        players.forEach((player, index) => {
            const panel = document.getElementById(`player-${player.color}-panel`);
            if (panel) {
                // Update name, avatar, tokens finished, tokens at home, etc.
                // panel.querySelector(".player-name").textContent = player.name;
                // panel.querySelector(".tokens-finished").textContent = player.tokensFinished;
            }
        });
    },

    updateTurnDisplay: function() {
        const currentPlayerIndex = StateManager.getStateByPath("currentPlayerIndex");
        const players = StateManager.getStateByPath("players");
        // Example: Highlight the current player panel
        document.querySelectorAll(".player-panel").forEach(panel => panel.classList.remove("current-turn"));
        const currentPlayerPanel = document.getElementById(`player-${players[currentPlayerIndex].color}-panel`);
        if (currentPlayerPanel) {
            currentPlayerPanel.classList.add("current-turn");
        }
        DiceRenderer.updateDiceFace(0); // Reset dice visual
        console.log(`Current turn: Player ${players[currentPlayerIndex].color}`);
    },

    handleGameOver: function(winnerIndex) {
        const winner = StateManager.getStateByPath(`players[${winnerIndex}]`);
        UIManager.showGameOverScreen(winner.name, winner.color);
        DiceRenderer.setDiceClickable(false, null); // Disable dice
        // Offer options like "Play Again", "Back to Home"
    }
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.GameTableManager = GameTableManager;

