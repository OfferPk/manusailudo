// home_screen_manager.js: Manages the Home Screen UI and interactions

const HomeScreenManager = {
    init: function() {
        this._setupEventListeners();
        this.updateDisplay(); // Initial display update (e.g., player profile placeholders)
        console.log("HomeScreenManager initialized.");
    },

    _setupEventListeners: function() {
        // Game Mode Selection Buttons
        Utils.qsa(".game-mode-card").forEach(button => {
            button.addEventListener("click", (event) => {
                const gameMode = event.currentTarget.dataset.mode;
                console.log(`Game mode selected: ${gameMode}`);
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                
                let numPlayers = 0;
                let modeType = "classic";

                if (gameMode.includes("2p")) numPlayers = 2;
                if (gameMode.includes("4p")) numPlayers = 4;
                if (gameMode.includes("arrow")) modeType = "arrow";
                
                // Update state and switch to game table or player selection if needed
                StateManager.updateState({
                    numberOfPlayers: numPlayers,
                    selectedGameMode: gameMode,
                    // activePlayers will be set after player colors are chosen or by default
                });
                Main.startGame(modeType, numPlayers); // Or navigate to a player color selection first
            });
        });

        // Settings Button
        const settingsBtn = Utils.$("home-settings-btn");
        if (settingsBtn) {
            settingsBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                UIManager.showModal("settings-modal");
            });
        }
        
        // Notifications Button (Placeholder)
        const notificationsBtn = Utils.$("home-notifications-btn");
        if (notificationsBtn) {
            notificationsBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                alert("Notifications clicked - Feature not yet implemented.");
            });
        }

        // Bottom Navigation Buttons (Placeholders for now, except "Games")
        Utils.qsa("#home-bottom-nav button").forEach(button => {
            button.addEventListener("click", (event) => {
                const target = event.currentTarget.dataset.target;
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                if (target === "home") {
                    UIManager.switchScreen("home-screen");
                } else {
                    alert(`${target.charAt(0).toUpperCase() + target.slice(1)} navigation clicked - Feature not yet implemented.`);
                }
                // Update active state for bottom nav buttons if needed
            });
        });
    },

    updateDisplay: function() {
        // Update dynamic elements on the home screen, e.g., player name, level, currencies
        // These would typically come from StateManager or a dedicated UserProfileManager
        const userProfile = StateManager.getStateByPath("userProfile"); // Assuming userProfile state
        UIManager.updatePlayerProfileDisplay(
            userProfile?.name || "Guest Player", 
            userProfile?.level || 1, 
            userProfile?.avatar || CONFIG.IMAGES.defaultAvatar
        );
        UIManager.updateCurrencyDisplay(
            userProfile?.gold || 0, 
            userProfile?.diamonds || 0
        );
    }
};

// Make HomeScreenManager globally accessible (if not using modules)
// window.HomeScreenManager = HomeScreenManager; // Or export default HomeScreenManager; if using modules
