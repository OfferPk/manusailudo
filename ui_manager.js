// ui_manager.js: Manages screen transitions and general UI updates

const UIManager = {
    currentScreenId: null,
    screens: {}, // Stores references to screen DOM elements
    modals: {}, // Stores references to modal DOM elements
    notificationTimeout: null,

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
    },

    showModal: function(modalId) {
        if (!this.modals[modalId]) {
            console.error(`Modal with id "${modalId}" not found.`);
            return;
        }
        Utils.addClass(this.modals[modalId], "active");
        console.log(`Modal shown: ${modalId}`);
    },

    hideModal: function(modalId) {
        if (!this.modals[modalId]) {
            console.error(`Modal with id "${modalId}" not found.`);
            return;
        }
        Utils.removeClass(this.modals[modalId], "active");
        console.log(`Modal hidden: ${modalId}`);
    },

    // Update dynamic content within the UI
    updateElementText: function(elementId, text) {
        const element = Utils.qs(`#${elementId}`);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`Element with id "${elementId}" not found for text update.`);
        }
    },

    updateElementHTML: function(elementId, html) {
        const element = Utils.qs(`#${elementId}`);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element with id "${elementId}" not found for HTML update.`);
        }
    },

    setElementImage: function(elementId, imageUrl) {
        const element = Utils.qs(`#${elementId}`);
        if (element && element.tagName === "IMG") {
            element.src = imageUrl;
        } else if (element) { // For divs with background image
            element.style.backgroundImage = `url(${imageUrl})`;
        } else {
            console.warn(`Image element with id "${elementId}" not found.`);
        }
    },

    toggleElementVisibility: function(elementId, show) {
        const element = Utils.qs(`#${elementId}`);
        if (element) {
            element.style.display = show ? "" : "none"; // Or flex, block, etc., depending on element type
        } else {
            console.warn(`Element with id "${elementId}" not found for visibility toggle.`);
        }
    },

    showNotification: function(message, duration = 3000) {
        const notificationArea = Utils.qs("#notification-area");
        if (!notificationArea) {
            console.warn("Notification area element not found.");
            alert(message); // Fallback to alert
            return;
        }

        notificationArea.textContent = message;
        Utils.addClass(notificationArea, "visible");

        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        this.notificationTimeout = setTimeout(() => {
            Utils.removeClass(notificationArea, "visible");
        }, duration);
    }
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.UIManager = UIManager;

