// ui_manager.js: Manages screen transitions and general UI updates

const UIManager = {
    currentScreenId: null,
    screens: {},
    modals: {},

    init: function() {
        // Discover all screens and modals defined in HTML
        Utils.qsa(".screen").forEach(screenEl => {
            this.screens[screenEl.id] = screenEl;
        });
        Utils.qsa(".modal").forEach(modalEl => {
            this.modals[modalEl.id] = modalEl;
        });

        // Set initial screen based on game state (e.g., loading screen)
        // This might be handled by main.js calling switchScreen initially
        console.log("UIManager initialized. Found screens:", Object.keys(this.screens));
        console.log("UIManager initialized. Found modals:", Object.keys(this.modals));
    },

    switchScreen: function(screenId) {
        if (!this.screens[screenId]) {
            console.error(`Screen with id "${screenId}" not found.`);
            return;
        }

        if (this.currentScreenId && this.screens[this.currentScreenId]) {
            Utils.removeClass(this.screens[this.currentScreenId], "active");
        }
        
        Utils.addClass(this.screens[screenId], "active");
        this.currentScreenId = screenId;
        console.log(`Switched to screen: ${screenId}`);

        // Update game state (handled by StateManager via main.js or specific managers)
        // StateManager.updateState({ currentScreen: screenId });
    },

    showModal: function(modalId) {
        if (!this.modals[modalId]) {
            console.error(`Modal with id "${modalId}" not found.`);
            return;
        }
        Utils.addClass(this.modals[modalId], "active"); // Assuming modals also use .active to show
        console.log(`Showing modal: ${modalId}`);
    },

    hideModal: function(modalId) {
        if (!this.modals[modalId]) {
            console.error(`Modal with id "${modalId}" not found.`);
            return;
        }
        Utils.removeClass(this.modals[modalId], "active");
        console.log(`Hiding modal: ${modalId}`);
    },

    // Example of updating a UI element dynamically
    updatePlayerProfileDisplay: function(playerName, playerLevel, avatarSrc) {
        const nameEl = Utils.$("home-player-name");
        const levelEl = Utils.$("home-player-level");
        const avatarEl = Utils.$("home-avatar-img");

        if (nameEl) nameEl.textContent = playerName || "Player";
        if (levelEl) levelEl.textContent = playerLevel ? `Lv. ${playerLevel}` : "Lv. 1";
        if (avatarEl) avatarEl.src = avatarSrc || CONFIG.IMAGES.defaultAvatar;
    },

    updateCurrencyDisplay: function(gold, diamonds) {
        const goldEl = Utils.$("home-gold-currency");
        const diamondsEl = Utils.$("home-diamonds-currency");

        if (goldEl) goldEl.textContent = `Gold: ${gold || 0}`;
        if (diamondsEl) diamondsEl.textContent = `Diamonds: ${diamonds || 0}`;
    },
    
    displayVictoryMessage: function(winnerName) {
        const messageEl = Utils.$("victory-message");
        if (messageEl) {
            messageEl.textContent = `${winnerName} Wins!`;
        }
        this.switchScreen("victory-screen");
    }
};

// Make UIManager globally accessible (if not using modules)
// window.UIManager = UIManager; // Or export default UIManager; if using modules
