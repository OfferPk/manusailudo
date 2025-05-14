// utils.js: Helper functions

const Utils = {
    // Generate a random integer between min (inclusive) and max (inclusive)
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Select a DOM element by ID
    $: function(id) {
        return document.getElementById(id);
    },

    // Select a DOM element using a CSS selector
    qs: function(selector) {
        return document.querySelector(selector);
    },

    // Select all DOM elements matching a CSS selector
    qsa: function(selector) {
        return document.querySelectorAll(selector);
    },

    // Create a DOM element with optional class and attributes
    createElement: function(tag, className = "", attributes = {}) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        for (const attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                element.setAttribute(attr, attributes[attr]);
            }
        }
        return element;
    },

    // Add a class to an element
    addClass: function(element, className) {
        if (element && !element.classList.contains(className)) {
            element.classList.add(className);
        }
    },

    // Remove a class from an element
    removeClass: function(element, className) {
        if (element && element.classList.contains(className)) {
            element.classList.remove(className);
        }
    },

    // Toggle a class on an element
    toggleClass: function(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    },

    // Show an element (removes 'hidden' class or sets display style)
    showElement: function(element) {
        if (element) {
            Utils.removeClass(element, "hidden");
            // Or, if not using a hidden class specifically for display none:
            // element.style.display = ''; // Or 'flex', 'block' etc. depending on context
        }
    },

    // Hide an element (adds 'hidden' class or sets display: none)
    hideElement: function(element) {
        if (element) {
            Utils.addClass(element, "hidden");
            // Or:
            // element.style.display = 'none';
        }
    },

    // Get a deep copy of an object or array
    deepCopy: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Shuffle an array (Fisher-Yates shuffle)
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

// Make Utils globally accessible (if not using modules)
// window.Utils = Utils; // Or export default Utils; if using modules
