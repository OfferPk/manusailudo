// main.js: Main game initialization and flow control

const Main = {
    init: function() {
        console.log("Main initializing...");
        
        console.log("Checking critical objects before use:");
        console.log("typeof CONFIG:", typeof CONFIG);
        console.log("typeof Utils:", typeof Utils);
        console.log("typeof UIManager:", typeof UIManager);
        console.log("typeof StateManager:", typeof StateManager);
        console.log("typeof AssetsManager:", typeof AssetsManager);

        if (typeof CONFIG !== 'object') {
            console.error("CONFIG object is not defined. Check config.js.");
            return;
        }
        if (typeof Utils !== 'object') {
            console.error("Utils object is not defined. Check utils.js.");
            return;
        }

        if (typeof UIManager !== 'object' || typeof UIManager.init !== 'function') {
            console.error("UIManager is not correctly defined or UIManager.init is not a function.");
            return; 
        }
        console.log("Calling UIManager.init()...");
        UIManager.init();

        if (typeof StateManager !== 'object' || typeof StateManager.init !== 'function') {
            console.error("StateManager is not correctly defined or StateManager.init is not a function.");
            return; 
        }
        console.log("Calling StateManager.init()...");
        StateManager.init();

        if (typeof AssetsManager !== 'object' || typeof AssetsManager.init !== 'function') {
            console.error("AssetsManager is not correctly defined or AssetsManager.init is not a function.");
            return; 
        }
        console.log("Calling AssetsManager.init()...");
        AssetsManager.init(() => {
            console.log("AssetsManager callback: Assets loaded, proceeding from Main.");
            this.goHome();
        });
        console.log("Main.init() finished setting up calls to managers.");
    },

    goHome: function() {
        console.log("Main.goHome() called.");
        StateManager.updateState({ 
            currentScreen: "home-screen", 
            winner: null, 
            currentPlayerIndex: -1, 
            activePlayers: [], 
            playerData: {} 
        });
        if (typeof HomeScreenManager !== 'object' || typeof HomeScreenManager.init !== 'function') {
            console.error("HomeScreenManager is not correctly defined or HomeScreenManager.init is not a function.");
            return; 
        }
        HomeScreenManager.init(); 
        HomeScreenManager.updateDisplay();
        UIManager.switchScreen("home-screen");
        console.log("Main.goHome() finished.");
    },

    startGame: function(gameModeType, numPlayers) {
        console.log(`Main: Starting game - Mode: ${gameModeType}, Players: ${numPlayers}`);
        console.log("At start of Main.startGame, typeof window.GameTableManager:", typeof window.GameTableManager, "Value:", window.GameTableManager);

        let playerColors = [];
        if (numPlayers === 2) {
            playerColors = ["red", "yellow"];
        } else if (numPlayers === 4) {
            playerColors = ["red", "green", "yellow", "blue"];
        } else {
            console.error("Invalid number of players selected.");
            return;
        }

        StateManager.initializePlayerData(playerColors);
        StateManager.updateState({
            numberOfPlayers: numPlayers,
            selectedGameMode: gameModeType, 
            currentPlayerIndex: 0, 
            diceRolled: false,
            diceValue: 0,
            winner: null
        });

        UIManager.switchScreen("game-table-screen");

        if (typeof window.GameTableManager !== 'object' || typeof window.GameTableManager.activate !== 'function') {
            console.error("window.GameTableManager is not correctly defined or window.GameTableManager.activate is not a function. Current value of window.GameTableManager:", window.GameTableManager);
            return; 
        }
        window.GameTableManager.activate();
        console.log("Main.startGame() finished and GameTableManager.activate() called.");
    },

    _setupPlayerSelection: function() {
        // This function is currently not called as goHome goes directly to home screen.
        // If re-enabled, add checks for button existence.
        console.log("Main._setupPlayerSelection() called.");
        const btn2p = Utils.$("2-players-btn");
        const btn4p = Utils.$("4-players-btn");
        const btnClassic = Utils.$("classic-mode-btn");
        const btnArrow = Utils.$("arrow-mode-btn");

        if(btn2p) btn2p.onclick = () => {
            this.startGame(StateManager.getStateByPath("selectedGameMode") || "classic", 2);
        };
        if(btn4p) btn4p.onclick = () => {
            this.startGame(StateManager.getStateByPath("selectedGameMode") || "classic", 4);
        };
        if(btnClassic) btnClassic.onclick = () => StateManager.updateState({selectedGameMode: "classic"});
        if(btnArrow) btnArrow.onclick = () => StateManager.updateState({selectedGameMode: "arrow"});
        console.log("Main._setupPlayerSelection() finished.");
    },
    
    setupGlobalEventListeners: function() {
        console.log("Main.setupGlobalEventListeners() called.");
        const closeSettingsBtn = Utils.$("close-settings-modal-btn");
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener("click", () => {
                UIManager.hideModal("settings-modal");
            });
        }

        const soundToggle = Utils.$("sound-toggle");
        if (soundToggle) {
            soundToggle.onchange = (event) => {
                console.log("Sound toggle changed:", event.target.checked);
            };
        }
        const musicToggle = Utils.$("music-toggle");
        if (musicToggle) {
            musicToggle.onchange = (event) => {
                console.log("Music toggle changed:", event.target.checked);
            };
        }
        
        const playAgainBtn = Utils.$("play-again-btn");
        if(playAgainBtn) {
            playAgainBtn.onclick = () => {
                const lastState = StateManager.getState();
                this.startGame(lastState.selectedGameMode, lastState.numberOfPlayers);
            };
        }
        const backToHomeBtn = Utils.$("back-to-home-btn");
        if(backToHomeBtn) {
            backToHomeBtn.onclick = () => {
                this.goHome();
            };
        }
        console.log("Main.setupGlobalEventListeners() finished.");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired.");
    Main.init();
    Main.setupGlobalEventListeners();
    console.log("Initial setup on DOMContentLoaded finished.");
});
