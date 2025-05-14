// assets_manager.js: Manages loading and access to game assets (images, sounds)

const AssetsManager = {
    images: {},
    sounds: {},
    imagesLoaded: 0,
    imagesToLoad: 0,
    soundsLoaded: 0, // Basic tracking, actual loading might be more complex for audio
    soundsToLoad: 0,
    onAllAssetsLoadedCallback: null,

    init: function(callback) {
        this.onAllAssetsLoadedCallback = callback;
        this._loadImages();
        this._loadSounds(); // Basic sound loading, might need more robust solution

        // If no assets to load, callback immediately
        if (this.imagesToLoad === 0 && this.soundsToLoad === 0) {
            if (this.onAllAssetsLoadedCallback) {
                this.onAllAssetsLoadedCallback();
            }
        }
    },

    _loadImages: function() {
        const imageSources = CONFIG.IMAGES;
        this.imagesToLoad = Object.keys(imageSources).length;
        if (this.imagesToLoad === 0) {
            this._checkAllAssetsLoaded();
            return;
        }

        for (const key in imageSources) {
            if (imageSources.hasOwnProperty(key)) {
                this.images[key] = new Image();
                this.images[key].onload = () => {
                    this.imagesLoaded++;
                    console.log(`Image loaded: ${key}`);
                    this._checkAllAssetsLoaded();
                };
                this.images[key].onerror = () => {
                    console.error(`Error loading image: ${key} at ${imageSources[key]}`);
                    this.imagesLoaded++; // Count as loaded to not block indefinitely, but log error
                    this._checkAllAssetsLoaded();
                };
                this.images[key].src = imageSources[key];
            }
        }
    },

    _loadSounds: function() {
        // Basic sound object creation. Actual loading and playback are more complex
        // and often require user interaction to start on browsers.
        // For now, we just acknowledge them. A proper sound library might be needed for robust features.
        const soundSources = CONFIG.SOUNDS;
        this.soundsToLoad = Object.keys(soundSources).length;
        if (this.soundsToLoad === 0) {
            this._checkAllAssetsLoaded();
            return;
        }

        for (const key in soundSources) {
            if (soundSources.hasOwnProperty(key)) {
                this.sounds[key] = new Audio(soundSources[key]);
                // Browsers may not preload audio fully until user interaction or play() is called.
                // We can listen to events like `canplaythrough` but it can be unreliable for full preloading.
                this.sounds[key].oncanplaythrough = () => {
                    // This event might fire multiple times or not at all depending on browser and file size
                    // For simplicity, we will assume it means it is somewhat ready.
                    // console.log(`Sound ready (canplaythrough): ${key}`);
                };
                this.sounds[key].onerror = () => {
                    console.error(`Error loading sound: ${key} at ${soundSources[key]}`);
                };
                // We will count sounds as "loaded" for the initial loading sequence for now.
                this.soundsLoaded++; 
            }
        }
        // Since audio preloading is tricky, we assume they are "accounted for" quickly.
        if (this.soundsLoaded === this.soundsToLoad) {
             this._checkAllAssetsLoaded();
        }
    },

    _checkAllAssetsLoaded: function() {
        if (this.imagesLoaded === this.imagesToLoad && this.soundsLoaded === this.soundsToLoad) {
            console.log("All assets loaded.");
            if (this.onAllAssetsLoadedCallback) {
                this.onAllAssetsLoadedCallback();
            }
        }
    },

    getImage: function(key) {
        if (!this.images[key]) {
            console.warn(`Image "${key}" not found or not loaded.`);
            // Optionally return a placeholder image or null
            return null; 
        }
        return this.images[key];
    },

    playSound: function(key, volume = 1.0) {
        if (!this.sounds[key]) {
            console.warn(`Sound "${key}" not found or not loaded.`);
            return;
        }
        // Stop and rewind if already playing, to allow rapid re-triggering
        this.sounds[key].pause();
        this.sounds[key].currentTime = 0;
        this.sounds[key].volume = volume;
        this.sounds[key].play().catch(error => console.warn(`Error playing sound ${key}: ${error}`));
    },

    stopSound: function(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    }
};

// Make AssetsManager globally accessible (if not using modules)
// window.AssetsManager = AssetsManager; // Or export default AssetsManager; if using modules
