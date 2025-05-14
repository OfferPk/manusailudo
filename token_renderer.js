// token_renderer.js: Responsible for creating, updating, and rendering tokens

const TokenRenderer = {
    tokenElements: {}, // Store references to token DOM elements, e.g., { "red-token-0": DOMElement, ... }
    tokenContainer: null, // The DOM element that will hold all tokens (usually the board area)

    init: function(containerId = "game-board-area") {
        this.tokenContainer = document.getElementById(containerId);
        if (!this.tokenContainer) {
            console.error(`Token container with id "${containerId}" not found.`);
            return;
        }
        this.tokenElements = {}; // Reset on init
        console.log("TokenRenderer initialized.");
    },

    // Create token elements for all players based on initial state
    createPlayerTokens: function(playersData) {
        if (!this.tokenContainer) return;
        this.tokenContainer.innerHTML = "; // Clear previous tokens if any (or manage them more selectively)
        this.tokenElements = {};

        playersData.forEach(player => {
            player.tokens.forEach((token, index) => {
                const tokenId = `${player.color}-token-${index}`;
                const tokenElement = this._createTokenElement(tokenId, player.color, index);
                this.tokenElements[tokenId] = tokenElement;
                this.tokenContainer.appendChild(tokenElement);
                this._updateTokenPosition(token, player.color, index); // Position it based on initial state (home)
            });
        });
        console.log("Player tokens created and rendered.");
    },

    _createTokenElement: function(tokenId, playerColor, tokenIndex) {
        const tokenEl = document.createElement("div");
        tokenEl.id = tokenId;
        tokenEl.className = `token token-${playerColor.toLowerCase()}`;
        tokenEl.dataset.playerId = playerColor; // Store player color for identification
        tokenEl.dataset.tokenIndex = tokenIndex; // Store token index
        // tokenEl.textContent = tokenIndex + 1; // Optional: display token number
        return tokenEl;
    },

    // Update the visual position of a single token
    _updateTokenPosition: function(tokenData, playerColor, tokenIndex) {
        const tokenId = `${playerColor}-token-${tokenIndex}`;
        const tokenElement = this.tokenElements[tokenId];
        if (!tokenElement) return;

        let pos = { x: 0, y: 0 }; // Default to some off-board or initial position

        switch (tokenData.state) {
            case "home":
                pos = BoardRenderer.getHomeBasePosition(playerColor, tokenIndex);
                tokenElement.style.zIndex = 10; // Ensure home tokens are clickable if needed
                break;
            case "active":
                pos = BoardRenderer.getTilePosition(tokenData.position);
                tokenElement.style.zIndex = 20; // Active tokens above home tokens
                break;
            case "homestretch":
                pos = BoardRenderer.getHomeStretchTilePosition(playerColor, tokenData.position);
                tokenElement.style.zIndex = 20;
                break;
            case "finished":
                pos = BoardRenderer.getFinishedAreaPosition(playerColor, tokenIndex);
                tokenElement.style.zIndex = 5; // Finished tokens can be less prominent
                tokenElement.classList.add("finished");
                break;
            default:
                console.warn("Unknown token state:", tokenData.state);
                // Hide or place in a default spot
                tokenElement.style.left = "-100px"; 
                tokenElement.style.top = "-100px";
                return;
        }

        tokenElement.style.left = `${pos.x}px`;
        tokenElement.style.top = `${pos.y}px`;
        // console.log(`Token ${tokenId} moved to ${pos.x}, ${pos.y} (State: ${tokenData.state}, BoardPos: ${tokenData.position})`);
    },

    // Animate token movement (can be simple or complex)
    moveToken: function(playerColor, tokenIndex, newTokenData, callback) {
        const tokenId = `${playerColor}-token-${tokenIndex}`;
        const tokenElement = this.tokenElements[tokenId];
        if (!tokenElement) {
            if(callback) callback();
            return;
        }

        // For simplicity, directly update position. For animation:
        // 1. Calculate path (series of intermediate tile positions)
        // 2. Animate step-by-step or use CSS transitions on left/top properties.
        // For now, just snap to new position.
        this._updateTokenPosition(newTokenData, playerColor, tokenIndex);
        
        // Simulate animation time if CSS transitions are set up
        // The actual duration should match CSS transition duration
        setTimeout(() => {
            if (callback) callback();
        }, CONFIG.ANIMATION_SPEEDS.tokenMove || 300); 
    },

    sendTokenHome: function(playerColor, tokenIndex) {
        const tokenData = StateManager.getStateByPath(`players`).find(p => p.color === playerColor).tokens[tokenIndex];
        // GameLogic should have already updated the tokenData state to "home"
        this._updateTokenPosition(tokenData, playerColor, tokenIndex);
        // AssetsManager.playSound(CONFIG.SOUNDS.tokenReturnHome); // Optional sound
    },

    highlightPlayableTokens: function(playableTokens, playerColor) {
        this.clearAllHighlights();
        playableTokens.forEach(move => {
            const tokenId = `${playerColor}-token-${move.tokenIndex}`;
            const tokenElement = this.tokenElements[tokenId];
            if (tokenElement) {
                tokenElement.classList.add("highlighted");
            }
        });
    },

    clearAllHighlights: function() {
        for (const tokenId in this.tokenElements) {
            this.tokenElements[tokenId].classList.remove("highlighted");
        }
    },

    // Refresh all token positions based on current game state
    // Useful after loading a game or if a full redraw is needed
    renderAllTokens: function(playersData) {
        if (!playersData) {
            playersData = StateManager.getStateByPath("players");
        }
        if (!playersData) return;

        playersData.forEach(player => {
            player.tokens.forEach((token, index) => {
                this._updateTokenPosition(token, player.color, index);
            });
        });
        console.log("All tokens re-rendered based on current state.");
    }
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.TokenRenderer = TokenRenderer;

