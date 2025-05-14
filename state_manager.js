// state_manager.js: Manages the overall game state

const StateManager = {
    _state: {},
    _subscribers: [], // For an observer pattern, if needed for complex reactivity

    init: function(initialState = CONFIG.INITIAL_GAME_STATE) {
        this._state = Utils.deepCopy(initialState);
        console.log("StateManager initialized with initial state:", this._state);
    },

    getState: function() {
        return Utils.deepCopy(this._state); // Return a copy to prevent direct modification
    },

    // Get a specific part of the state by path (e.g., "playerData.red.score")
    getStateByPath: function(path) {
        const keys = path.split(".");
        let current = this._state;
        for (const key of keys) {
            if (current && typeof current === "object" && key in current) {
                current = current[key];
            } else {
                return undefined; // Path not found
            }
        }
        return Utils.deepCopy(current);
    },

    updateState: function(newStatePartial) {
        // Deep merge the partial state into the current state
        this._deepMerge(this._state, newStatePartial);
        console.log("State updated:", newStatePartial, "New full state:", this._state);
        this._notifySubscribers();
    },

    // Helper for deep merging objects (mutates target object)
    _deepMerge: function(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                    if (!target[key] || typeof target[key] !== "object") {
                        target[key] = {};
                    }
                    this._deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    },

    // --- Player and Token Specific State Management ---
    initializePlayerData: function(playerColors) { // playerColors is an array like ["red", "green"]
        const playerData = {};
        playerColors.forEach(color => {
            playerData[color] = {
                id: color,
                name: CONFIG.PLAYER_COLORS[color].name || `Player ${color.charAt(0).toUpperCase() + color.slice(1)}`,
                colorHex: CONFIG.PLAYER_COLORS[color].hex,
                tokens: [],
                tokensAtHome: 0,
                tokensInYard: CONFIG.TOKENS_PER_PLAYER,
                hasRolledSixToStart: false, // Tracks if player has rolled a 6 to get first token out
                startTileIndex: CONFIG.START_TILE_INDICES[color],
                homeStretchEntryPathIndex: CONFIG.HOME_STRETCH_ENTRY_INDICES[color],
                homeStretchTiles: CONFIG.HOME_STRETCH_LENGTH
            };
            for (let i = 0; i < CONFIG.TOKENS_PER_PLAYER; i++) {
                playerData[color].tokens.push({
                    id: `${color}-token-${i}`,
                    playerId: color,
                    index: i,
                    pathPosition: -1, // -1 means in yard
                    homeYardPosition: i, // Position within the yard (0 to TOKENS_PER_PLAYER-1)
                    onBoard: false,
                    inHomeStretch: false,
                    homeStretchPosition: -1, // Position within their home stretch (0 to HOME_STRETCH_LENGTH-1)
                    reachedHome: false,
                    element: null // DOM element reference, to be set by TokenRenderer
                });
            }
        });
        this.updateState({ playerData: playerData, activePlayers: playerColors });
    },

    getCurrentPlayer: function() {
        if (this._state.currentPlayerIndex === -1 || !this._state.activePlayers.length) {
            return null;
        }
        const currentPlayerColor = this._state.activePlayers[this._state.currentPlayerIndex];
        return this._state.playerData[currentPlayerColor];
    },

    getTokenState: function(playerId, tokenIndex) {
        if (this._state.playerData[playerId] && this._state.playerData[playerId].tokens[tokenIndex]) {
            return Utils.deepCopy(this._state.playerData[playerId].tokens[tokenIndex]);
        }
        return null;
    },

    updateTokenState: function(playerId, tokenIndex, newPartialTokenState) {
        if (this._state.playerData[playerId] && this._state.playerData[playerId].tokens[tokenIndex]) {
            const tokenState = this._state.playerData[playerId].tokens[tokenIndex];
            this._deepMerge(tokenState, newPartialTokenState);
            // No need to call this.updateState if we directly mutated _state, but good practice for notifications
            this._notifySubscribers(); // Notify if direct mutation
            console.log(`Token state updated for ${playerId}-token-${tokenIndex}:`, newPartialTokenState);
        } else {
            console.error(`Cannot update token state: Player ${playerId} or token ${tokenIndex} not found.`);
        }
    },
    
    // --- Subscription mechanism for reactivity (optional, can be expanded) ---
    subscribe: function(callback) {
        this._subscribers.push(callback);
    },

    unsubscribe: function(callback) {
        this._subscribers = this._subscribers.filter(sub => sub !== callback);
    },

    _notifySubscribers: function() {
        const currentState = this.getState(); // Get a fresh copy for subscribers
        this._subscribers.forEach(callback => callback(currentState));
    }
};

// Make StateManager globally accessible (if not using modules)
// window.StateManager = StateManager; // Or export default StateManager; if using modules
