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
        // Ensure tokenContainer is part of the boardElement from BoardRenderer for correct layering
        // or that it is positioned correctly over the board canvas/image.
        this.tokenElements = {}; // Reset on init
        console.log("TokenRenderer initialized.");
    },

    // Create token elements for all players based on initial state
    createPlayerTokens: function(playersData) {
        if (!this.tokenContainer) return;
        
        // Clear only token elements, not the entire board container which might hold the canvas
        Object.values(this.tokenElements).forEach(el => el.remove());
        this.tokenElements = {};

        playersData.forEach(player => {
            player.tokens.forEach((token, index) => {
                const tokenId = `${player.color}-token-${index}`;
                const tokenElement = this._createTokenElement(tokenId, player.color, index);
                this.tokenElements[tokenId] = tokenElement;
                this.tokenContainer.appendChild(tokenElement); // Append to the logical grid tile or a dedicated token layer
                this._updateTokenPosition(token, player.color, index, true); // Position it based on initial state (home)
            });
        });
        console.log("Player tokens created and rendered.");
    },

    _createTokenElement: function(tokenId, playerColor, tokenIndex) {
        const tokenEl = document.createElement("div");
        tokenEl.id = tokenId;
        tokenEl.className = `token token-${playerColor.toLowerCase()}`;
        tokenEl.dataset.playerId = playerColor;
        tokenEl.dataset.tokenIndex = tokenIndex;

        // Get the correct cosmic token image
        let tokenImageAssetKey;
        switch (playerColor.toLowerCase()) {
            case "red":    tokenImageAssetKey = "redToken";    break;
            case "green":  tokenImageAssetKey = "greenToken";  break;
            case "yellow": tokenImageAssetKey = "yellowToken"; break;
            case "blue":   tokenImageAssetKey = "blueToken";   break;
            default: tokenImageAssetKey = "redToken"; // Fallback
        }
        const tokenImg = AssetsManager.getImage(tokenImageAssetKey);
        if (tokenImg) {
            tokenEl.style.backgroundImage = `url(${tokenImg.src})`;
            tokenEl.style.backgroundSize = "contain";
            tokenEl.style.backgroundRepeat = "no-repeat";
            tokenEl.style.backgroundPosition = "center";
            // Set width and height based on tile size or a fixed token size
            // This should be coordinated with CSS and BoardRenderer.getTileElementBy... size
            tokenEl.style.width = "80%"; // Example: 80% of the tile size
            tokenEl.style.height = "80%";
            tokenEl.style.position = "absolute"; // Tokens are positioned within tiles
        } else {
            // Fallback if image not loaded - use player color as background
            tokenEl.style.backgroundColor = CONFIG.PLAYER_COLORS[playerColor.toLowerCase()].hex;
            tokenEl.style.width = "30px";
            tokenEl.style.height = "30px";
            tokenEl.style.borderRadius = "50%";
            tokenEl.style.textAlign = "center";
            tokenEl.style.lineHeight = "30px";
            tokenEl.textContent = tokenIndex + 1;
        }
        tokenEl.style.transition = "left 0.3s ease, top 0.3s ease"; // For smooth movement
        return tokenEl;
    },

    // Update the visual position of a single token
    _updateTokenPosition: function(tokenData, playerColor, tokenIndex, isInitialSetup = false) {
        const tokenId = `${playerColor}-token-${tokenIndex}`;
        const tokenElement = this.tokenElements[tokenId];
        if (!tokenElement) return;

        let targetTileElement = null;

        switch (tokenData.state) {
            case "home":
                targetTileElement = BoardRenderer.getHomeBaseTile(playerColor, tokenIndex);
                tokenElement.style.zIndex = 10;
                break;
            case "active":
                targetTileElement = BoardRenderer.getTileElementByPathIndex(tokenData.position);
                tokenElement.style.zIndex = 20;
                break;
            case "homestretch":
                // Assuming home stretch path indices are distinct and handled by BoardRenderer
                // Or, if home stretch position is 0-5, need a specific getter
                targetTileElement = BoardRenderer.getTileElementByCoords(CONFIG.HOME_STRETCH_COORDINATES[playerColor][tokenData.position].r, CONFIG.HOME_STRETCH_COORDINATES[playerColor][tokenData.position].c);
                tokenElement.style.zIndex = 20;
                break;
            case "finished":
                // Need a way to get finished area position from BoardRenderer
                // For now, let's place it on the last home stretch tile and mark as finished
                targetTileElement = BoardRenderer.getTileElementByCoords(CONFIG.HOME_STRETCH_COORDINATES[playerColor][CONFIG.HOME_STRETCH_LENGTH -1].r, CONFIG.HOME_STRETCH_COORDINATES[playerColor][CONFIG.HOME_STRETCH_LENGTH -1].c);
                tokenElement.style.zIndex = 5;
                tokenElement.classList.add("finished");
                tokenElement.style.opacity = "0.5";
                break;
            default:
                console.warn("Unknown token state:", tokenData.state);
                tokenElement.style.display = "none";
                return;
        }

        if (targetTileElement) {
            // Instead of absolute pixel positioning, append token to the target tile div
            // The tile div should be styled for flex/grid centering of the token
            if (tokenElement.parentElement !== targetTileElement) {
                 targetTileElement.appendChild(tokenElement);
            }
            // Reset explicit top/left if appending to tile, let CSS handle centering
            tokenElement.style.left = ""; 
            tokenElement.style.top = "";
            tokenElement.style.display = "block"; // Ensure it's visible
        } else {
            console.warn(`Target tile not found for token ${tokenId} in state ${tokenData.state}`);
            tokenElement.style.display = "none"; // Hide if no valid tile
        }
    },

    moveToken: function(playerColor, tokenIndex, newTokenData, callback) {
        const tokenId = `${playerColor}-token-${tokenIndex}`;
        const tokenElement = this.tokenElements[tokenId];
        if (!tokenElement) {
            if(callback) callback();
            return;
        }
        
        // Update position. CSS transitions on parent change (if re-appending) or on left/top will handle animation.
        // If re-appending to a new tile, the browser handles the move.
        // If using absolute positioning within a single container, then left/top changes trigger CSS transition.
        this._updateTokenPosition(newTokenData, playerColor, tokenIndex);
        
        // Callback after CSS transition time
        setTimeout(() => {
            if (callback) callback();
        }, CONFIG.ANIMATION_SPEEDS.tokenMove || 300);
    },

    sendTokenHome: function(playerColor, tokenIndex, tokenData) {
        // GameLogic should have already updated the tokenData state to "home"
        this._updateTokenPosition(tokenData, playerColor, tokenIndex);
    },

    highlightPlayableTokens: function(playableTokens, playerColor) {
        this.clearAllHighlights();
        playableTokens.forEach(move => {
            const tokenId = `${playerColor}-token-${move.tokenIndex}`;
            const tokenElement = this.tokenElements[tokenId];
            if (tokenElement) {
                tokenElement.classList.add("highlighted"); // CSS will define this (e.g., border, glow)
            }
        });
    },

    clearAllHighlights: function() {
        for (const tokenId in this.tokenElements) {
            this.tokenElements[tokenId].classList.remove("highlighted");
        }
    },

    renderAllTokens: function(playersData) {
        if (!playersData) {
            playersData = StateManager.getStateByPath("players");
        }
        if (!playersData) return;

        // Re-create tokens if they don_t exist (e.g., initial load)
        if (Object.keys(this.tokenElements).length === 0) {
            this.createPlayerTokens(playersData);
        } else {
            playersData.forEach(player => {
                player.tokens.forEach((token, index) => {
                    this._updateTokenPosition(token, player.color, index);
                });
            });
        }
        console.log("All tokens re-rendered based on current state.");
    }
};

