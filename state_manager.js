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

    updateState: function(newStateChunk) {
        // Deep merge the new state chunk into the current state
        this._state = Utils.deepMerge(this._state, newStateChunk);
        console.log("State updated:", newStateChunk, "New full state:", this._state);
        this._notifySubscribers();
        this.saveStateToLocalStorage(); // Persist state
    },

    // Update a specific item in the state by path
    updateStateItem: function(path, value) {
        const keys = path.split(".");
        let current = this._state;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== "object") {
                current[key] = {}; // Create path if it doesn_t exist
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = Utils.deepCopy(value);
        console.log(`State item updated at ${path}:`, value, "New full state:", this._state);
        this._notifySubscribers();
        this.saveStateToLocalStorage(); // Persist state
    },

    resetState: function(initialState = CONFIG.INITIAL_GAME_STATE) {
        this._state = Utils.deepCopy(initialState);
        console.log("State reset to initial state:", this._state);
        this._notifySubscribers();
        this.saveStateToLocalStorage();
    },

    // --- Subscription mechanism (Observer Pattern) ---
    subscribe: function(callback) {
        this._subscribers.push(callback);
        console.log("New subscriber added.");
    },

    unsubscribe: function(callback) {
        this._subscribers = this._subscribers.filter(sub => sub !== callback);
        console.log("Subscriber removed.");
    },

    _notifySubscribers: function() {
        console.log(`Notifying ${this._subscribers.length} subscribers.`);
        const currentState = this.getState(); // Get a fresh copy for subscribers
        this._subscribers.forEach(callback => {
            try {
                callback(currentState);
            } catch (error) {
                console.error("Error in subscriber callback:", error);
            }
        });
    },

    // --- Local Storage Persistence ---
    saveStateToLocalStorage: function() {
        try {
            const serializedState = JSON.stringify(this._state);
            localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, serializedState);
            console.log("Game state saved to localStorage.");
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    },

    loadStateFromLocalStorage: function() {
        try {
            const serializedState = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
            if (serializedState === null) {
                console.log("No saved state found in localStorage. Using initial state.");
                this.resetState(); // Or just keep the current default initial state
                return false; // Indicate no state was loaded
            }
            const loadedState = JSON.parse(serializedState);
            this._state = Utils.deepMerge(CONFIG.INITIAL_GAME_STATE, loadedState); // Merge with default to ensure all keys are present
            console.log("Game state loaded from localStorage:", this._state);
            this._notifySubscribers(); // Notify about the loaded state
            return true; // Indicate state was loaded
        } catch (error) {
            console.error("Error loading state from localStorage:", error);
            this.resetState(); // Fallback to initial state on error
            return false;
        }
    }
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.StateManager = StateManager;

