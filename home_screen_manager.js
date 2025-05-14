// home_screen_manager.js: Manages the Home Screen UI and interactions

const HomeScreenManager = {
    isInitialized: false,

    init: function() {
        if (this.isInitialized) return;
        this._setupEventListeners();
        this.updateDisplay(); // Initial display update (e.g., player profile placeholders)
        console.log("HomeScreenManager initialized.");
        this.isInitialized = true;
    },

    activate: function() {
        this.init(); // Ensure initialized
        this.updateDisplay();
        UIManager.showScreen("home-screen");
        console.log("Home Screen activated.");
    },

    _setupEventListeners: function() {
        // Game Mode Selection Buttons (using specific IDs from advanced_ludo.html)
        const playFriendBtn = document.getElementById("play-friend-btn");
        const playOnlineBtn = document.getElementById("play-online-btn");
        const playComputerBtn = document.getElementById("play-computer-btn");
        const tournamentsBtn = document.getElementById("tournaments-btn");

        if (playFriendBtn) {
            playFriendBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                alert("Play with Friends - Not yet implemented. Starting Classic 2 Player game.");
                // For now, let's default to starting a game or going to player selection
                Main.startGame("classic", 2); 
            });
        }
        if (playOnlineBtn) {
            playOnlineBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                alert("Play Online - Not yet implemented. Starting Classic 4 Player game.");
                Main.startGame("classic", 4);
            });
        }
        if (playComputerBtn) {
            playComputerBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                // UIManager.showScreen("player-selection-screen"); // Or directly start with AI
                alert("Play with Computer - Not yet implemented. Starting Classic 2 Player game vs AI.");
                Main.startGame("classic_ai", 2); // Need a way to specify AI
            });
        }
        if (tournamentsBtn) {
            tournamentsBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                alert("Tournaments - Not yet implemented.");
            });
        }

        // Daily Reward Button
        const dailyRewardBtn = document.getElementById("daily-reward-btn");
        if (dailyRewardBtn) {
            dailyRewardBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                alert("Daily Reward claimed! (Feature not fully implemented)");
                // Logic for daily reward system
            });
        }

        // Footer Buttons
        const settingsBtnHome = document.getElementById("settings-btn-home");
        const shopBtn = document.getElementById("shop-btn");
        const leaderboardBtn = document.getElementById("leaderboard-btn");

        if (settingsBtnHome) {
            settingsBtnHome.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                UIManager.showScreen("settings-screen");
            });
        }
        if (shopBtn) {
            shopBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                alert("Shop - Not yet implemented.");
                // UIManager.showScreen("shop-screen");
            });
        }
        if (leaderboardBtn) {
            leaderboardBtn.addEventListener("click", () => {
                // AssetsManager.playSound(CONFIG.SOUNDS.buttonClick);
                alert("Leaderboard - Not yet implemented.");
                // UIManager.showScreen("leaderboard-screen");
            });
        }
    },

    updateDisplay: function() {
        // Update dynamic elements on the home screen, e.g., player name, level, currencies
        // These would typically come from StateManager or a dedicated UserProfileManager
        const userProfile = StateManager.getStateByPath("userProfile") || { name: "Player", coins: 0, gems: 0, avatar: CONFIG.IMAGES.defaultAvatar }; 
        
        const playerNameHome = document.getElementById("player-name-home");
        const playerAvatarHome = document.getElementById("player-avatar-home");
        const playerCoins = document.getElementById("player-coins");
        const playerGems = document.getElementById("player-gems");

        if (playerNameHome) playerNameHome.textContent = userProfile.name;
        if (playerAvatarHome) playerAvatarHome.src = userProfile.avatar || CONFIG.IMAGES.defaultAvatar;
        if (playerCoins) playerCoins.textContent = userProfile.coins;
        if (playerGems) playerGems.textContent = userProfile.gems;
    }
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.HomeScreenManager = HomeScreenManager;

