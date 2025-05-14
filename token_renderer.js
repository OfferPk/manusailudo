// token_renderer.js: Responsible for creating, updating, and rendering tokens

const TokenRenderer = {
    tokenElements: {}, // Store references to token DOM elements, e.g., { "red-token-0": DOMElement, ... }

    init: function() {
        this.tokenElements = {};
        console.log("TokenRenderer initialized.");
    },

    // Create token elements for all players based on initial state
    createPlayerTokens: function(playerData) {
        for (const playerId in playerData) {
            if (playerData.hasOwnProperty(playerId)) {
                const player = playerData[playerId];
                player.tokens.forEach(tokenState => {
                    const tokenEl = this._createTokenElement(tokenState.id, player.id, player.colorHex, tokenState.index);
                    this.tokenElements[tokenState.id] = tokenEl;
                    // Initially, tokens are in the yard. Position them there.
                    this.updateTokenPosition(tokenState, player.id, player.startTileIndex, player.homeStretchEntryPathIndex, player.homeStretchTiles);
                });
            }
        }
    },

    _createTokenElement: function(tokenId, playerId, colorHex, tokenIndex) {
        const tokenEl = Utils.createElement("div", "token");
        tokenEl.id = tokenId;
        tokenEl.dataset.playerId = playerId;
        tokenEl.dataset.tokenIndex = tokenIndex;
        tokenEl.style.backgroundColor = colorHex;
        // Add a small number or identifier inside the token if needed
        // tokenEl.textContent = tokenIndex + 1;
        
        // Append to a general container or let BoardRenderer/GameTableManager decide where they live initially
        // For now, we assume they will be appended to specific tiles by updateTokenPosition
        return tokenEl;
    },

    // Update a single token's visual position and state
    updateTokenPosition: function(tokenState, playerId, playerStartTile, playerHomeEntry, playerHomeStretchSize) {
        const tokenEl = this.tokenElements[tokenState.id];
        if (!tokenEl) {
            console.error(`Token element not found for ${tokenState.id}`);
            return;
        }

        // Remove from previous tile if any
        if (tokenEl.parentElement) {
            tokenEl.parentElement.removeChild(tokenEl);
        }

        let targetTileEl = null;

        if (tokenState.reachedHome) {
            // Position in the center goal area or a dedicated "home" display area
            const centerGoal = BoardRenderer.getTileElementByCoords(7, 7); // Example center
            if (centerGoal) {
                targetTileEl = centerGoal; 
                Utils.addClass(tokenEl, "token-reached-home");
            }
        } else if (tokenState.inHomeStretch) {
            // Find the correct home stretch tile
            // This requires BoardRenderer to have a way to get home stretch tiles by player and index
            targetTileEl = this._getHomeStretchTileElement(playerId, tokenState.homeStretchPosition, playerHomeEntry, playerHomeStretchSize);
            Utils.removeClass(tokenEl, "token-on-board");
            Utils.addClass(tokenEl, "token-in-home-stretch");
        } else if (tokenState.onBoard) {
            targetTileEl = BoardRenderer.getTileElementByPathIndex(tokenState.pathPosition);
            Utils.addClass(tokenEl, "token-on-board");
            Utils.removeClass(tokenEl, "token-in-home-stretch");
        } else { // In yard
            targetTileEl = this._getYardTileElement(playerId, tokenState.homeYardPosition);
            Utils.removeClass(tokenEl, "token-on-board");
            Utils.removeClass(tokenEl, "token-in-home-stretch");
            Utils.removeClass(tokenEl, "token-reached-home");
        }

        if (targetTileEl) {
            targetTileEl.appendChild(tokenEl);
        } else {
            console.warn(`Could not find target tile for token ${tokenState.id}`, tokenState);
            // Fallback: append to game board area directly if no tile found (should not happen)
            Utils.$("game-board-area").appendChild(tokenEl);
        }
        
        // Update visual cues for selectability, etc. (handled by GameTableManager based on valid moves)
    },
    
    _getYardTileElement: function(playerId, yardPosition) {
        // This needs a more robust way to map yard positions to specific tiles in the home base area
        // For simplicity, let's assume yard tiles are at fixed coordinates within each player's base area
        // Example: Red's yard tiles could be (1,1), (1,2), (2,1), (2,2)
        let r, c;
        switch(playerId) {
            case "red":    r = 1 + Math.floor(yardPosition / 2); c = 1 + (yardPosition % 2); break;
            case "green":  r = 1 + Math.floor(yardPosition / 2); c = 10 + (yardPosition % 2); break; // Adjusted for 15x15, blue is top right
            case "yellow": r = 10 + Math.floor(yardPosition / 2); c = 10 + (yardPosition % 2); break;
            case "blue":   r = 10 + Math.floor(yardPosition / 2); c = 1 + (yardPosition % 2); break; // Adjusted for 15x15, green is bottom left
            // The above yard positions for green and blue are swapped from typical Ludo if red is top-left.
            // Let's re-evaluate based on BoardRenderer's _getBoardLayout home base areas:
            // Red: (0,0) area, Green: (9,0) area, Blue: (0,9) area, Yellow: (9,9) area
            // If yard is 2x2 within a 6x6 base area, e.g., at offset [1,1] from base corner
            case "red":    r = 1 + Math.floor(yardPosition / 2); c = 1 + (yardPosition % 2); break; // (1,1) (1,2) (2,1) (2,2)
            case "blue":   r = 1 + Math.floor(yardPosition / 2); c = 9 + 1 + (yardPosition % 2); break; // (1,10) (1,11) (2,10) (2,11)
            case "green":  r = 9 + 1 + Math.floor(yardPosition / 2); c = 1 + (yardPosition % 2); break; // (10,1) (10,2) (11,1) (11,2)
            case "yellow": r = 9 + 1 + Math.floor(yardPosition / 2); c = 9 + 1 + (yardPosition % 2); break; // (10,10) (10,11) (11,10) (11,11)
        }
        return BoardRenderer.getTileElementByCoords(r, c);
    },

    _getHomeStretchTileElement: function(playerId, stretchPosition, playerHomeEntry, playerHomeStretchSize) {
        // This needs to map player + stretchPosition to actual r,c coordinates
        // Based on BoardRenderer's layout for home stretches
        let r, c;
        switch(playerId) {
            case "red":    r = 7; c = 1 + stretchPosition; break;
            case "green":  r = 1 + stretchPosition; c = 7; break;
            case "yellow": r = 7; c = 13 - stretchPosition; break;
            case "blue":   r = 13 - stretchPosition; c = 7; break;
            default: return null;
        }
        return BoardRenderer.getTileElementByCoords(r,c);
    },

    // Highlight selectable tokens
    highlightSelectableTokens: function(selectableTokenIds) {
        // First, remove highlight from all tokens
        for (const tokenId in this.tokenElements) {
            Utils.removeClass(this.tokenElements[tokenId], "token-selectable");
        }
        // Then, add highlight to selectable ones
        selectableTokenIds.forEach(tokenId => {
            if (this.tokenElements[tokenId]) {
                Utils.addClass(this.tokenElements[tokenId], "token-selectable");
            }
        });
    },

    // Clear all highlights
    clearTokenHighlights: function() {
        for (const tokenId in this.tokenElements) {
            Utils.removeClass(this.tokenElements[tokenId], "token-selectable");
        }
    }
};

// Make TokenRenderer globally accessible (if not using modules)
// window.TokenRenderer = TokenRenderer; // Or export default TokenRenderer; if using modules
