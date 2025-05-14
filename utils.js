// utils.js: Utility functions for the Ludo game

const Utils = {
    // Deep copy an object or array
    deepCopy: function(obj) {
        if (typeof obj !== "object" || obj === null) {
            return obj; // Return primitives or null as is
        }

        let copy;
        if (Array.isArray(obj)) {
            copy = [];
            for (let i = 0; i < obj.length; i++) {
                copy[i] = Utils.deepCopy(obj[i]);
            }
        } else {
            copy = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    copy[key] = Utils.deepCopy(obj[key]);
                }
            }
        }
        return copy;
    },

    // Deep merge two objects (target will be mutated)
    deepMerge: function(target, source) {
        if (typeof target !== "object" || target === null || typeof source !== "object" || source === null) {
            return source; // If source is primitive or target is not an object, return source
        }

        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                    if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
                        target[key] = {}; // Initialize target[key] as an object if it_s not already one
                    }
                    Utils.deepMerge(target[key], source[key]);
                } else {
                    target[key] = Utils.deepCopy(source[key]); // Use deepCopy for arrays and primitives
                }
            }
        }
        return target;
    },

    // Query selector shorthand
    qs: function(selector, parent = document) {
        return parent.querySelector(selector);
    },

    // Query selector all shorthand
    qsa: function(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },

    // Create DOM element with attributes and children
    createElement: function(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        for (const key in attributes) {
            if (key === "className") {
                element.className = attributes[key];
            } else if (key === "textContent") {
                element.textContent = attributes[key];
            } else if (key.startsWith("data-")) {
                element.dataset[key.substring(5)] = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        }
        children.forEach(child => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },

    // Add class to element
    addClass: function(element, className) {
        if (element && !element.classList.contains(className)) {
            element.classList.add(className);
        }
    },

    // Remove class from element
    removeClass: function(element, className) {
        if (element && element.classList.contains(className)) {
            element.classList.remove(className);
        }
    },

    // Toggle class on element
    toggleClass: function(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    },

    // Get random integer between min (inclusive) and max (inclusive)
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Shuffle an array (Fisher-Yates shuffle)
    shuffleArray: function(array) {
        const arr = Utils.deepCopy(array);
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Add more utility functions as needed, e.g., for event handling, debouncing, throttling, etc.
};

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.Utils = Utils;

