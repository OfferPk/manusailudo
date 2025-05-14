// config.js: Game constants and initial settings

const CONFIG = {
    PLAYER_COLORS: {
        red: { hex: "#e74c3c", name: "Red" },
        green: { hex: "#2ecc71", name: "Green" },
        yellow: { hex: "#f1c40f", name: "Yellow" },
        blue: { hex: "#3498db", name: "Blue" }
    },
    TOKENS_PER_PLAYER: 4,
    BOARD_DIMENSIONS: 15, // 15x15 grid for the Ludo board
    PATH_LENGTH: 52, // Standard Ludo path length (excluding home stretch)
    HOME_STRETCH_LENGTH: 6,

    // Tile indices for player start positions on the main path
    // These are 0-indexed based on a 52-step path
    START_TILE_INDICES: {
        red: 0,
        green: 13,
        yellow: 26,
        blue: 39
    },

    // Path indices where players enter their home stretch
    HOME_STRETCH_ENTRY_INDICES: {
        red: 50,    // Red enters home after tile 50 (0-51 path)
        green: 11,  // Green enters home after tile 11
        yellow: 24, // Yellow enters home after tile 24
        blue: 37   // Blue enters home after tile 37
    },

    // Define safe zone path indices (0-indexed)
    SAFE_ZONE_INDICES: [0, 8, 13, 21, 26, 34, 39, 47],

    // Define arrow tile path indices and their bonus moves
    // Example: { index: 4, bonus: 3 } means landing on path tile 4 gives 3 extra steps
    ARROW_TILES: [
        { index: 4, bonus: 3 },
        { index: 17, bonus: 3 },
        { index: 30, bonus: 3 },
        { index: 43, bonus: 3 }
    ],

    INITIAL_GAME_STATE: {
        currentScreen: "loading", // Initial screen
        numberOfPlayers: 0,
        selectedGameMode: null, // e.g., "classic_2p", "arrow_4p"
        activePlayers: [], // Array of player color strings, e.g., ["red", "blue"]
        currentPlayerIndex: -1, // Index in activePlayers array
        diceValue: 0,
        diceRolled: false,
        turnConsecutiveSixes: 0,
        playerData: { // Will be populated based on selected players
            // red: { tokens: [ { id: 0, ... }, ... ], score: 0, ... },
            // green: { ... }, ...
        }
    },

    // Sound asset paths (placeholders)
    SOUNDS: {
        diceRoll: "sounds/dice_roll.mp3",
        tokenMove: "sounds/token_move.mp3",
        tokenCapture: "sounds/token_capture.mp3",
        gameWin: "sounds/game_win.mp3",
        buttonClick: "sounds/button_click.mp3"
    },

    // Image asset paths (placeholders)
    IMAGES: {
        defaultAvatar: "images/avatar_default.png",
        diceFace1: "images/dice_1.png",
        // ... dice faces 2-6
        // ... other UI elements if needed
    }
};

// Make CONFIG globally accessible (if not using modules, which we are for structure)
// For simple script tags, this will be global. If using ES6 modules, export it.
// window.CONFIG = CONFIG; // Or export default CONFIG; if using modules
