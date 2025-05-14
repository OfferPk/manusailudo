// dice_renderer.js: Responsible for rendering and animating the dice

const DiceRenderer = {
    diceContainer: null,
    diceImageElement: null, // To display dice face image
    rollButton: null,

    init: function(diceImageId = "dice-image", rollButtonId = "roll-dice-btn") {
        this.diceImageElement = document.getElementById(diceImageId);
        this.rollButton = document.getElementById(rollButtonId);

        if (!this.diceImageElement) {
            console.error(`Dice image element with id "${diceImageId}" not found.`);
            // return; // Allow to continue if button exists
        }
        if (!this.rollButton) {
            console.error(`Roll button with id "${rollButtonId}" not found.`);
            // return;
        }
        this.updateDiceFace(1); // Show initial dice face (e.g., 1)
        console.log("DiceRenderer initialized.");
    },

    // Update the dice display with the rolled value
    updateDiceFace: function(value) {
        if (this.diceImageElement && value >= 1 && value <= 6) {
            this.diceImageElement.src = CONFIG.IMAGES[`dice${value}`];
            this.diceImageElement.alt = `Dice ${value}`;
        }
    },

    // Call this when the dice is about to be rolled to show an animation
    showRollingAnimation: function(callback) {
        if (!this.diceImageElement) return;

        this.diceImageElement.classList.add("rolling");
        let rollCount = 0;
        const maxRolls = 10; // Number of quick changes for animation
        const intervalTime = 50; // Time between changes

        const animationInterval = setInterval(() => {
            const randomFace = Math.floor(Math.random() * 6) + 1;
            this.updateDiceFace(randomFace);
            rollCount++;
            if (rollCount >= maxRolls) {
                clearInterval(animationInterval);
                this.diceImageElement.classList.remove("rolling");
                if (callback) callback(); // Call the main callback after animation
            }
        }, intervalTime);
    },

    // Enable or disable the dice roll button and set its click handler
    setDiceClickable: function(clickable, onRollCallback) {
        if (this.rollButton) {
            this.rollButton.disabled = !clickable;
            if (clickable) {
                this.rollButton.classList.remove("disabled");
                // Remove old listener before adding new one to prevent duplicates
                this.rollButton.onclick = null; 
                this.rollButton.onclick = () => {
                    this.rollButton.disabled = true; // Disable button immediately after click
                    this.rollButton.classList.add("disabled");
                    this.showRollingAnimation(() => {
                        if(onRollCallback) onRollCallback();
                        // The game logic should re-enable the button if another roll is allowed or for next turn
                    });
                };
            } else {
                this.rollButton.classList.add("disabled");
                this.rollButton.onclick = null;
            }
        }
    }
};

/* Add to style.css:
.dice-image.rolling {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.roll-dice-btn.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
*/

// If not using ES6 modules:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.DiceRenderer = DiceRenderer;

