// main.js: Main game initialization and flow control

const Main = {
    init: function() {
        console.log("Main initializing...");

        // Check for critical objects before use
        console.log("Checking critical objects before use:");
        console.log("typeof CONFIG:", typeof CONFIG);
        console.log("typeof Utils:", typeof Utils);
        console.log("typeof UIManager:", typeof UIManager);
        console.log("typeof StateManager:", typeof StateManager);
        console.log("typeof AssetsManager:", typeof AssetsManager);
        console.log("typeof GameLogic:", typeof GameLogic);
        console.log("typeof HomeScreenManager:", typeof HomeScreenManager);
        console.log("typeof GameTableManager:", typeof GameTableManager);

        if (typeof CONFIG !== 'object') {
            console.error("CONFIG object is not defined. Check config.js.");
            return;
        }
        if (typeof Utils !== 'object') {
            console.error("Utils object is not defined. Check utils.js (if you have one, or ensure its functions are global).");
            // return; // Utils might be a collection of global functions, not an object
        }
        if (typeof UIManager !== 'object' || typeof UIManager.init !== 'function') {
            console.error("UIManager is not correctly defined or UIManager.init is not a function.");
            return;
        }
        if (typeof StateManager !== 'object' || typeof StateManager.init !== 'function') {
            console.error("StateManager is not correctly defined or StateManager.init is not a function.");
            return;
        }
        if (typeof AssetsManager !== 'object' || typeof AssetsManager.init !== 'function') {
            console.error("AssetsManager is not correctly defined or AssetsManager.init is not a function.");
            return;
        }
        if (typeof GameLogic !== 'object') { // GameLogic might not have an init, it's a collection of methods
            console.error("GameLogic object is not defined.");
            return;
        }
        if (typeof HomeScreenManager !== 'object' || typeof HomeScreenManager.init !== 'function') {
            console.error("HomeScreenManager is not correctly defined or HomeScreenManager.init is not a function.");
            return;
        }
        if (typeof GameTableManager !== 'object' || typeof GameTableManager.init !== 'function') {
            console.error("GameTableManager is not correctly defined or GameTableManager.init is not a function.");
            return;
        }

        // Initialize core modules
        console.log("Calling UIManager.init()...");
        UIManager.init(); // Sets up basic UI structure, screen visibility
        
        console.log("Calling StateManager.init()...");
        StateManager.init(); // Initializes the default state
        
        console.log("Calling AssetsManager.init()...");
        AssetsManager.init(() => {
            console.log("Assets loaded. Proceeding with game setup.");
            // Assets are loaded, now initialize other managers that might depend on them or state
            this.setupApplication();
        });
    },

    setupApplication: function() {
        console.log("Setting up application...");
        // Initialize screen managers (they might set up event listeners)
        HomeScreenManager.init();
        GameTableManager.init(); // Initializes board, dice, token renderers internally
        // Other managers like SettingsScreenManager, ShopScreenManager etc. would be init here too

        // Set initial user profile (example)
        StateManager.updateState({
            userProfile: {
                name: "Ludo Champ",
                level: 5,
                avatar: CONFIG.IMAGES.defaultAvatar, // Make sure this path is correct in config
                coins: 1000,
                gems: 50
            }
        });

        // Load preferences or saved game state if any
        // this.loadPreferences();
        // this.loadSavedGame();

        // Start with the home screen
        console.log("Activating Home Screen...");
        HomeScreenManager.activate(); 
        // UIManager.switchScreen("home-screen"); // HomeScreenManager.activate should handle this

        console.log("Main setup complete. Game is ready.");
    },

    startGame: function(gameModeType = "classic", numPlayers = 2) {
        console.log(`Main: Starting game - Mode: ${gameModeType}, Players: ${numPlayers}`);
        
        // Potentially set AI players based on gameModeType or numPlayers
        // For example, if gameModeType is "classic_ai" and numPlayers is 2, one player is AI.
        let isVsAI = gameModeType.includes("_ai");

        GameLogic.initializeGame(numPlayers); // Sets up players, tokens, initial state

        if (isVsAI && numPlayers > 1) {
            // Assume player 2 (index 1) is AI if it's a 2-player AI game
            // This logic needs to be more robust for more players or specific AI player selection
            StateManager.updateStateItem(`players[1].isAI`, true);
            StateManager.updateStateItem(`players[1].name`, "AI Opponent");
            console.log("AI opponent initialized for Player 2.");
        }

        // Update state with game mode details
        StateManager.updateState({
            currentGameMode: gameModeType,
            numberOfPlayers: numPlayers, // This might be redundant if already set by HomeScreenManager
            gamePhase: "playing" // Ensure gamePhase is set correctly
        });

        // Switch to the game table screen
        // UIManager.switchScreen("game-table-screen"); // GameTableManager.activate should handle this
        GameTableManager.activate();
        console.log("Game table activated for new game.");
    },

    endCurrentGame: function(navigateToHomeScreen = true) {
        console.log("Ending current game...");
        // Reset relevant game state, but keep player profiles, currency etc.
        StateManager.updateState({
            currentPlayerIndex: 0,
            diceValue: null,
            diceRolled: false,
            turnConsecutiveSixes: 0,
            gamePhase: "ended", // Or "menu"
            winner: null,
            // players: [] // Or reset player tokens and scores within GameLogic.initializeGame
        });

        if (navigateToHomeScreen) {
            // UIManager.switchScreen("home-screen");
            HomeScreenManager.activate();
        }
    }

    // Potentially add methods for loading/saving game, preferences, etc.
    // loadPreferences: function() { ... }
    // savePreferences: function() { ... }
    // loadSavedGame: function() { ... }
    // saveCurrentGame: function() { ... }
};

// Initialize the game when the DOM is ready and all scripts are loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed. Initializing Main...");
    Main.init();
});

// If not using ES6 modules and want Main to be globally accessible:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.Main = Main;

