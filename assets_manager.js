// assets_manager.js: Manages loading and access to game assets (images, sounds, etc.)

const AssetsManager = {
    _images: {},
    _sounds: {},
    _music: {},
    _assetsLoaded: 0,
    _totalAssets: 0,
    _onLoadCompleteCallback: null,
    _isMuted: false,
    _currentMusic: null,

    init: function(callback) {
        console.log("AssetsManager initializing...");
        this._onLoadCompleteCallback = callback;
        this._assetsLoaded = 0;
        this._totalAssets = 0;

        // Define assets to load from CONFIG.ASSETS
        if (!CONFIG || !CONFIG.ASSETS) {
            console.error("CONFIG.ASSETS not defined. Cannot load assets.");
            if (this._onLoadCompleteCallback) this._onLoadCompleteCallback();
            return;
        }

        const { IMAGES, SOUNDS, MUSIC } = CONFIG.ASSETS;

        if (IMAGES) this._totalAssets += Object.keys(IMAGES).length;
        if (SOUNDS) this._totalAssets += Object.keys(SOUNDS).length;
        if (MUSIC) this._totalAssets += Object.keys(MUSIC).length;

        if (this._totalAssets === 0) {
            console.log("No assets defined to load.");
            if (this._onLoadCompleteCallback) this._onLoadCompleteCallback();
            return;
        }

        console.log(`Total assets to load: ${this._totalAssets}`);

        if (IMAGES) this._loadImages(IMAGES);
        if (SOUNDS) this._loadSounds(SOUNDS);
        if (MUSIC) this._loadMusic(MUSIC); // Music might be streamed or loaded differently
    },

    _assetLoaded: function(type, key, asset) {
        this._assetsLoaded++;
        console.log(`${type} loaded: ${key} (${this._assetsLoaded}/${this._totalAssets})`);
        if (this._assetsLoaded >= this._totalAssets) {
            console.log("All assets loaded successfully.");
            if (this._onLoadCompleteCallback) {
                this._onLoadCompleteCallback();
            }
        }
    },

    _assetLoadError: function(type, key, path, error) {
        console.error(`Error loading ${type} "${key}" from ${path}:`, error);
        // Still count as "loaded" to not block the game, but with an error state
        this._assetsLoaded++; 
        if (type === "image") this._images[key] = null; // Mark as failed
        if (type === "sound") this._sounds[key] = null;
        if (type === "music") this._music[key] = null;

        if (this._assetsLoaded >= this._totalAssets) {
            console.warn("Asset loading finished with some errors.");
            if (this._onLoadCompleteCallback) {
                this._onLoadCompleteCallback();
            }
        }
    },

    _loadImages: function(imagesToLoad) {
        for (const key in imagesToLoad) {
            if (imagesToLoad.hasOwnProperty(key)) {
                const path = imagesToLoad[key];
                const img = new Image();
                img.onload = () => {
                    this._images[key] = img;
                    this._assetLoaded("Image", key, img);
                };
                img.onerror = (err) => {
                    this._assetLoadError("Image", key, path, err);
                };
                img.src = path;
            }
        }
    },

    _loadSounds: function(soundsToLoad) {
        // HTML5 Audio for sound effects
        for (const key in soundsToLoad) {
            if (soundsToLoad.hasOwnProperty(key)) {
                const path = soundsToLoad[key];
                const audio = new Audio();
                // Preload enough to play, but don_t wait for full download for all sounds
                // Browsers handle this differently; `canplaythrough` is more robust but might take longer
                audio.oncanplaythrough = () => { // Or 'canplay'
                    this._sounds[key] = audio;
                    this._assetLoaded("Sound", key, audio);
                    audio.oncanplaythrough = null; // Remove listener once loaded
                };
                audio.onerror = (err) => {
                    this._assetLoadError("Sound", key, path, err);
                    audio.onerror = null;
                };
                audio.preload = "auto"; // Hint to browser to load
                audio.src = path;
                // Some browsers require user interaction to load/play audio.
                // We are just pre-caching the objects here.
            }
        }
    },

    _loadMusic: function(musicToLoad) {
        // Similar to sounds, but might be handled with a single audio element for background music
        for (const key in musicToLoad) {
            if (musicToLoad.hasOwnProperty(key)) {
                const path = musicToLoad[key];
                const audio = new Audio();
                audio.oncanplaythrough = () => {
                    this._music[key] = audio;
                    this._assetLoaded("Music", key, audio);
                    audio.oncanplaythrough = null;
                };
                audio.onerror = (err) => {
                    this._assetLoadError("Music", key, path, err);
                    audio.onerror = null;
                };
                audio.preload = "auto";
                audio.src = path;
            }
        }
    },

    getImage: function(key) {
        if (!this._images[key]) {
            console.warn(`Image asset "${key}" not found or failed to load.`);
            // Return a placeholder or default image if available in CONFIG
            return (CONFIG.ASSETS.PLACEHOLDERS && CONFIG.ASSETS.PLACEHOLDERS.IMAGE) ? this.getImage(CONFIG.ASSETS.PLACEHOLDERS.IMAGE) : null;
        }
        return this._images[key];
    },

    getSound: function(key) {
        if (!this._sounds[key]) {
            console.warn(`Sound asset "${key}" not found or failed to load.`);
            return null;
        }
        return this._sounds[key];
    },

    getMusic: function(key) {
        if (!this._music[key]) {
            console.warn(`Music asset "${key}" not found or failed to load.`);
            return null;
        }
        return this._music[key];
    },

    playSound: function(key, volume = 1.0) {
        if (this._isMuted) return;
        const sound = this.getSound(key);
        if (sound) {
            sound.currentTime = 0; // Rewind to start for short effects
            sound.volume = volume;
            sound.play().catch(e => console.warn(`Error playing sound ${key}:`, e));
        } else {
            console.warn(`Cannot play sound: "${key}" not loaded.`);
        }
    },

    playMusic: function(key, loop = true, volume = 0.5) {
        if (this._isMuted && key !== this._currentMusic) return; // Allow stopping current music even if muted
        
        if (this._currentMusic && this._currentMusic.key !== key) {
            this.stopMusic(this._currentMusic.key); // Stop previous music if different
        }

        const music = this.getMusic(key);
        if (music) {
            this._currentMusic = { audio: music, key: key };
            music.loop = loop;
            music.volume = this._isMuted ? 0 : volume;
            music.play().catch(e => console.warn(`Error playing music ${key}:`, e));
        } else {
            console.warn(`Cannot play music: "${key}" not loaded.`);
        }
    },

    stopMusic: function(key) {
        const musicTrack = this.getMusic(key);
        if (musicTrack) {
            musicTrack.pause();
            musicTrack.currentTime = 0;
            if (this._currentMusic && this._currentMusic.key === key) {
                this._currentMusic = null;
            }
        }
    },

    isMusicPlaying: function(key) {
        const musicTrack = this.getMusic(key);
        return musicTrack && !musicTrack.paused;
    },

    setMuted: function(muted) {
        this._isMuted = muted;
        console.log(`AssetsManager muted state: ${this._isMuted}`);
        if (this._currentMusic && this._currentMusic.audio) {
            this._currentMusic.audio.volume = this._isMuted ? 0 : (CONFIG.MUSIC_VOLUME || 0.5); // Adjust volume based on mute state
        }
        // Individual sound effect volumes are handled at playSound, but this global mute overrides them.
    },

    isMuted: function() {
        return this._isMuted;
    }
};

// Example in CONFIG.ASSETS (config.js):
// CONFIG.ASSETS = {
//     IMAGES: {
//         dice1: "assets/images/dice_1.png",
//         dice2: "assets/images/dice_2.png",
//         playerAvatarDefault: "assets/images/avatar_default.png",
//         coinIcon: "assets/images/coin.png",
//     },
//     SOUNDS: {
//         diceRoll: "assets/sounds/dice_roll.mp3",
//         tokenMove: "assets/sounds/token_move.wav",
//         tokenCapture: "assets/sounds/capture.wav",
//         gameWin: "assets/sounds/win.mp3",
//     },
//     MUSIC: {
//         backgroundMusic: "assets/music/bg_loop.mp3"
//     },
//     PLACEHOLDERS: {
//         IMAGE: "playerAvatarDefault" // Key of another image to use as placeholder
//     }
// };
// CONFIG.MUSIC_VOLUME = 0.5; // Default music volume

