// settings_manager.js: Manages game settings and preferences

const SettingsManager = {
    _settings: {},
    _defaultSettings: {
        soundEffects: true,
        backgroundMusic: true,
        allowSpectators: true,
        allowFollowers: true, // For chatrooms/social features if implemented
        showNationality: true,
        showBirthday: true,
        blockFriendRequests: false,
        // Add other game-specific settings here
        aiDifficulty: "medium",
        theme: "classic"
    },

    init: function() {
        this.loadSettings();
        console.log("SettingsManager initialized. Current settings:", this._settings);
        // Apply initial settings (e.g., mute sounds if soundEffects is false)
        this.applyAllSettings();
    },

    getSetting: function(key) {
        return this._settings.hasOwnProperty(key) ? this._settings[key] : this._defaultSettings[key];
    },

    updateSetting: function(key, value) {
        if (this._defaultSettings.hasOwnProperty(key)) {
            this._settings[key] = value;
            console.log(`Setting "${key}" updated to:`, value);
            this.saveSettings();
            this.applySetting(key, value); // Apply the specific setting immediately
        } else {
            console.warn(`Attempted to update unknown setting: "${key}"`);
        }
    },

    // Toggles a boolean setting
    toggleSetting: function(key) {
        if (typeof this.getSetting(key) === "boolean") {
            this.updateSetting(key, !this.getSetting(key));
        } else {
            console.warn(`Attempted to toggle non-boolean setting: "${key}"`);
        }
    },

    saveSettings: function() {
        try {
            localStorage.setItem(CONFIG.LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(this._settings));
            console.log("Settings saved to localStorage.");
        } catch (error) {
            console.error("Error saving settings to localStorage:", error);
        }
    },

    loadSettings: function() {
        try {
            const savedSettings = localStorage.getItem(CONFIG.LOCAL_STORAGE_SETTINGS_KEY);
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                // Merge with defaults to ensure all keys are present and new defaults are picked up
                this._settings = Utils.deepMerge(Utils.deepCopy(this._defaultSettings), parsedSettings);
            } else {
                this._settings = Utils.deepCopy(this._defaultSettings);
                console.log("No saved settings found, using defaults.");
            }
        } catch (error) {
            console.error("Error loading settings from localStorage:", error);
            this._settings = Utils.deepCopy(this._defaultSettings);
        }
        // Ensure all default keys are present even if not in savedSettings
        for (const key in this._defaultSettings) {
            if (!this._settings.hasOwnProperty(key)) {
                this._settings[key] = this._defaultSettings[key];
            }
        }
    },

    resetToDefaults: function() {
        this._settings = Utils.deepCopy(this._defaultSettings);
        this.saveSettings();
        this.applyAllSettings();
        console.log("Settings reset to defaults.");
        // Potentially notify UI to update
        if (UIManager && typeof UIManager.updateSettingsUI === "function") {
            UIManager.updateSettingsUI(this._settings);
        }
    },

    // Apply a single setting_s effect
    applySetting: function(key, value) {
        console.log(`Applying setting: ${key} = ${value}`);
        switch (key) {
            case "soundEffects":
                if (AssetsManager) AssetsManager.setMuted(!value);
                break;
            case "backgroundMusic":
                if (AssetsManager) {
                    if (value && !AssetsManager.isMusicPlaying(CONFIG.SOUNDS.backgroundMusic)) {
                        AssetsManager.playMusic(CONFIG.SOUNDS.backgroundMusic, true);
                    } else if (!value) {
                        AssetsManager.stopMusic(CONFIG.SOUNDS.backgroundMusic);
                    }
                }
                break;
            case "aiDifficulty":
                if (AIOpponent) AIOpponent.init(value); // Re-initialize AI with new difficulty
                break;
            // Add cases for other settings that have immediate effects
            // e.g., theme changes might trigger UIManager.applyTheme(value);
            case "allowSpectators":
            case "allowFollowers":
            case "showNationality":
            case "showBirthday":
            case "blockFriendRequests":
                // These settings might be checked by GameLogic or UIManager when relevant
                // For example, UIManager might hide/show nationality based on this setting
                // GameLogic might prevent spectating if allowSpectators is false
                console.log(`Setting "${key}" to "${value}" will be applied by relevant modules.`);
                break;
            default:
                // No specific immediate action for this setting, or handled elsewhere
                break;
        }
    },

    // Apply all current settings (e.g., on init or after loading)
    applyAllSettings: function() {
        for (const key in this._settings) {
            if (this._settings.hasOwnProperty(key)) {
                this.applySetting(key, this._settings[key]);
            }
        }
        console.log("All current settings applied.");
    }
};

// CONFIG.LOCAL_STORAGE_SETTINGS_KEY should be defined in config.js
// e.g., const LOCAL_STORAGE_SETTINGS_KEY = "ludoGameSettings";

// Example of how UIManager might update the UI for settings:
// UIManager.updateSettingsUI = function(settings) {
//     document.getElementById("sound-toggle").checked = settings.soundEffects;
//     document.getElementById("music-toggle").checked = settings.backgroundMusic;
//     // ... and so on for other settings UI elements
// };

// Initialization would typically happen in main.js after other core modules
// SettingsManager.init();

