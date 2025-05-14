// dice_renderer.js: Responsible for rendering and animating the dice

const DiceRenderer = {
    diceContainer: null,
    diceValueDisplay: null, // Could be a 3D model or a simple text display for now

    init: function(diceContainerId = "dice-container") {
        this.diceContainer = Utils.$(diceContainerId);
        if (!this.diceContainer) {
            console.error(`Dice container with id "${diceContainerId}" not found.`);
            return;
        }
        // For a simple display initially:
        this.diceValueDisplay = Utils.createElement("div", "dice-face");
        this.diceContainer.innerHTML = "; // Clear previous content
        this.diceContainer.appendChild(this.diceValueDisplay);
        this.diceValueDisplay.textContent = "-"; // Initial display
        console.log("DiceRenderer initialized.");
    },

    // Update the dice display with the rolled value
    updateDiceFace: function(value) {
        if (this.diceValueDisplay) {
            this.diceValueDisplay.textContent = value > 0 ? value : "-";
            // TODO: Implement 3D dice animation if required
            // For now, just show the number and maybe a quick animation
            this.diceContainer.classList.remove("rolling"); // Remove previous animation class
            void this.diceContainer.offsetWidth; // Trigger reflow
            this.diceContainer.classList.add("rolling"); // Add animation class
            
            // Remove animation class after it finishes (e.g., 0.5s)
            setTimeout(() => {
                this.diceContainer.classList.remove("rolling");
            }, 500);
        }
    },

    // Call this when the dice is about to be rolled to show an animation
    showRollingAnimation: function() {
        if (this.diceValueDisplay) {
            this.diceValueDisplay.textContent = "..."; // Or an animated GIF/sprite
            this.diceContainer.classList.add("rolling");
        }
    },

    // Enable or disable the dice (e.g., based on whose turn it is)
    setDiceClickable: function(clickable, callback) {
        const rollButton = Utils.$("roll-dice-btn"); // Assuming a roll button
        if (rollButton) {
            rollButton.disabled = !clickable;
            if (clickable) {
                Utils.removeClass(rollButton, "disabled");
                // Remove old listener before adding new one to prevent duplicates
                rollButton.onclick = null; 
                rollButton.onclick = callback; 
            } else {
                Utils.addClass(rollButton, "disabled");
                rollButton.onclick = null;
            }
        }
    }
};

// Add to style.css:
/*
.dice-container.rolling .dice-face {
    animation: rollAnim 0.5s ease-out;
}
@keyframes rollAnim {
    0% { transform: scale(1) rotate(0deg); opacity: 0.5; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 0.75; }
    100% { transform: scale(1) rotate(360deg); opacity: 1; }
}
.roll-dice-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
*/

// Make DiceRenderer globally accessible (if not using modules)
// window.DiceRenderer = DiceRenderer; // Or export default DiceRenderer; if using modules
