# manusailudo

manus ai build ludo
Rules of Ludo

Ludo is a classic board game that originated in late Victorian times, inspired by the ancient Indian game of Pachisi. Over time, various adaptations of Pachisi have emerged across the world. These include Parchís in Spain, Parcheesi in the United States, and Uckers—a version of Ludo commonly played in the Royal Navy and other naval forces—using a standard Ludo board. While the game has evolved in design and rules across cultures, its core gameplay and spirit of friendly competition remain the same.
Ludo Game Rules (Simplified)
Game Overview:
Ludo is a strategy board game inspired by the ancient Indian game Pachisi. It’s played on a cross-shaped board where each arm is divided into colored paths. Each player picks a color—Red, Blue, Green, Yellow (with optional Pink and Black in extended versions)—and tries to move all four tokens from their base to the center "home" area.

🧱 Board Setup
The board has four colored bases (start zones) at each corner.

Each player starts with 4 tokens in their colored base.

The track loops clockwise around the board, leading to a final stretch called the "home column".

Only a player’s own tokens can enter their home column and final triangle.

🎲 How to Play
Players take turns clockwise. The player with the highest roll goes first.

A single die is used. Roll a 6 to bring a token onto the board.

Rolling a 6 gives an extra turn.

Tokens move in a clockwise direction along the path.

If you roll a number that can't be used, your turn is skipped.

You decide which token to move after every roll.

💥 Captures & Blocks
Landing on an opponent’s token sends it back to their base.

Landing on your own token creates a block—opponents can’t pass or land on it.

🏁 Winning the Game
Tokens must complete a full circuit and enter the home triangle with an exact roll.

The first player to get all 4 tokens home wins.

🔄 Variants
For faster gameplay with kids, allow tokens to start on a roll of 1 or 6.

For advanced strategy, explore Pachisi, Chaupur, or Uckers rules.
Here's a detailed player path for a standard Ludo board supporting up to 6 players (Red, Blue, Green, Yellow, Pink, Black). This path assumes a 15x15 grid layout (standard for Ludo), starting from each color’s entry square and moving clockwise around the board.

Each color has:

A start position (entry onto the board).

A clockwise loop path shared by all players.

A home column (unique color path to the center).

Final home tile (must be reached with an exact roll).

🔴 Red Player Path (example)
Start square index: 0
Full movement path indexes:

cpp
Copy
Edit
[0, 1, 2, 3, 4, 5, 6,         // Right across top
 7, 8, 9, 10, 11, 12,         // Down right edge
 13, 14, 15, 16, 17, 18,      // Bottom right
 19, 20, 21, 22, 23, 24,      // Bottom across
 25, 26, 27, 28, 29, 30,      // Bottom left
 31, 32, 33, 34, 35, 36,      // Up left edge
 37, 38, 39, 40, 41, 42,      // Top left
 43, 44, 45, 46, 47, 48, 49]  // Back to top center left
➡️ After completing the loop (49), Red enters its home path:

csharp
Copy
Edit
[50, 51, 52, 53, 54, 55]  // Red home column leading to red home
Now we extend this logic to other colors by rotating the board directionally:

🔵 Blue Player Path
Start square index: 13

cpp
Copy
Edit
[13, 14, 15, 16, 17, 18,  // Bottom right
 19, 20, 21, 22, 23, 24,  
 25, 26, 27, 28, 29, 30,
 31, 32, 33, 34, 35, 36,
 37, 38, 39, 40, 41, 42,
 43, 44, 45, 46, 47, 48, 49,
 0, 1, 2, 3, 4, 5, 6,
 7, 8, 9, 10, 11, 12]
➡️ Blue home path:

csharp
Copy
Edit
[56, 57, 58, 59, 60, 61]
🟢 Green Player Path
Start at index: 26

csharp
Copy
Edit
[26, 27, 28, 29, 30, 31,
 32, 33, 34, 35, 36, 37,
 38, 39, 40, 41, 42, 43,
 44, 45, 46, 47, 48, 49,
 0, 1, 2, 3, 4, 5,
 6, 7, 8, 9, 10, 11, 12,
 13, 14, 15, 16, 17, 18,
 19, 20, 21, 22, 23, 24, 25]
➡️ Green home path:

csharp
Copy
Edit
[62, 63, 64, 65, 66, 67]
🟡 Yellow Player Path
Start at index: 39

csharp
Copy
Edit
[39, 40, 41, 42, 43, 44,
 45, 46, 47, 48, 49,
 0, 1, 2, 3, 4, 5, 6,
 7, 8, 9, 10, 11, 12,
 13, 14, 15, 16, 17, 18,
 19, 20, 21, 22, 23, 24,
 25, 26, 27, 28, 29, 30,
 31, 32, 33, 34, 35, 36, 37, 38]
➡️ Yellow home path:

csharp
Copy
Edit
[68, 69, 70, 71, 72, 73]
🩷 Pink Player Path (5th player)
Assumes extended board support.
Start index: 52 (custom)
➡️ Same rotation logic.
➡️ Home path:

csharp
Copy
Edit
[74, 75, 76, 77, 78, 79]
⚫ Black Player Path (6th player)
Start index: 65
➡️ Circular path adjusted accordingly.
➡️ Home path:

csharp
Copy
Edit
[80, 81, 82, 83, 84, 85]
🔁 Summary
Each player:

Has a unique start square.

Shares a common clockwise loop of 52 squares.

Has a unique 6-tile home column.

Must roll exact number to enter the final tile.
Here’s a full coordinate map for a standard Ludo board, rendered on a 15×15 grid with each cell being 40×40 pixels:

🎯 Main Path Coordinates (52 tiles):
These are the x, y canvas positions for token movement around the full board (clockwise, starting from Red's start tile):

scss
Copy
Edit
(40, 240), (80, 240), (120, 240), (160, 240), (200, 240), (240, 240),
(240, 200), (240, 160), (240, 120), (240, 80), (240, 40), (240, 0),
(280, 0), (320, 0), (320, 40), (320, 80), (320, 120), (320, 160),
(320, 200), (320, 240), (360, 240), (400, 240), (440, 240), (480, 240),
(520, 240), (560, 240), (560, 280), (560, 320), (520, 320), (480, 320),
(440, 320), (400, 320), (360, 320), (320, 320), (320, 360), (320, 400),
(320, 440), (320, 480), (320, 520), (320, 560), (280, 560), (240, 560),
(240, 520), (240, 480), (240, 440), (240, 400), (240, 360), (240, 320),
(200, 320), (160, 320), (120, 320), (80, 320)
🏠 Red Player Home Path to Center:
Coordinates from the home column to the center (final tile):

scss
Copy
Edit
(40, 280), (80, 280), (120, 280), (160, 280), (200, 280), (240, 280)
📐 Canvas Info:
Cell Size: 40 pixels

Grid Size: 15 × 15 (total canvas size = 600px × 600px)
To add a box collider (a rectangular clickable or interactive area) to each player's token place or position in your Ludo game using pure HTML5 Canvas and JavaScript, you'll need to simulate a collider using simple rectangle boundaries. Here's how to do it:

✅ Step-by-Step: Add Box Colliders for Tokens
🧩 1. Represent Token Colliders
Define each token’s position and its bounding box:

javascript
Copy
Edit
const tokenSize = 30; // width and height of token
const tokenPadding = 5; // margin inside the cell
const colliders = []; // store all token bounding boxes
📦 2. Add a Collider When Drawing a Token
Assuming you’re drawing tokens like this:

javascript
Copy
Edit
function drawToken(ctx, x, y, color) {
  const offset = tokenPadding;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + tokenSize / 2, y + tokenSize / 2, tokenSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Add a box collider to colliders array
  colliders.push({
    x: x,
    y: y,
    width: tokenSize,
    height: tokenSize,
    color: color // optional, for identification
  });
}
🖱️ 3. Check Mouse Click on Collider
Set up a canvas click listener:

javascript
Copy
Edit
canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (const box of colliders) {
    if (
      mouseX >= box.x && mouseX <= box.x + box.width &&
      mouseY >= box.y && mouseY <= box.y + box.height
    ) {
      console.log(`Clicked on ${box.color} token!`);
      // Add logic for selection, movement, etc.
    }
  }
});
🧹 4. Clear Colliders Each Frame (Optional)
If you use animation or redrawing:

javascript
Copy
Edit
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  colliders.length = 0; // clear old colliders before drawing new ones

  // Then draw all tokens with `drawToken()`
}
🧠 Tips
Each player typically has 4 tokens: manage their colliders as part of a player object or array.

You can also add extra fields like playerId, tokenIndex, or isHome in each collider object to enhance interactivity.

For drag-and-drop, use mousedown, mousemove, and mouseup events instead of click.
The best collider height and width for tokens in your Ludo game using canvas depends on your cell size, token size, and how precise you want user clicks to be.

Assuming a standard 15×15 board grid on a 600×600 canvas:

🎯 Recommended Canvas Setup
Item	Size (px)
Canvas size	600×600
Grid size	15×15
Each cell	40×40
Token size	30×30
Collider size	30×30

✅ Recommended Collider Size
javascript
Copy
Edit
const tokenSize = 30;  // token is a circle 30px diameter
const colliderSize = {
  width: tokenSize,
  height: tokenSize
};
This ensures:

Tokens fit visually within each 40×40 cell with 5px padding all around.

Colliders match the token's clickable size for reliable detection.

🧠 Alternative (Easier Clicking)
If your tokens are small and you want easier clicking, expand the collider slightly:

javascript
Copy
Edit
const colliderSize = {
  width: 36,  // or up to 40
  height: 36
};
Make sure the collider doesn't overlap into neighboring cells (especially when tokens are stacked or close together).

📌 Summary
Use Case	Suggested Collider Size
Accurate detection only	30×30 (same as token)
Easier user clicking	36×36 or 38×38
Full cell coverage (max)	40×40 (entire cell)
To check whether a Ludo player is ready to move, you can use a boolean flag for each player's turn and dice roll state.

✅ Example Setup for isReadyToMove Boolean
🧩 1. Player State
javascript
Copy
Edit
let players = [
  { name: "Red", isTurn: false, isReadyToMove: false, diceValue: 0 },
  { name: "Blue", isTurn: false, isReadyToMove: false, diceValue: 0 },
  // Add more players...
];

let currentPlayerIndex = 0;
🎲 2. On Dice Roll
javascript
Copy
Edit
function rollDice() {
  const currentPlayer = players[currentPlayerIndex];
  const roll = Math.floor(Math.random() * 6) + 1;
  currentPlayer.diceValue = roll;

  // Determine if the player can move
  if (canMove(currentPlayer, roll)) {
    currentPlayer.isReadyToMove = true;
  } else {
    currentPlayer.isReadyToMove = false;
    nextTurn(); // No move possible, switch to next player
  }

  // Show dice animation or result here
}
🤔 3. canMove() Logic
This function checks if the player has any valid move with the current roll:

javascript
Copy
Edit
function canMove(player, roll) {
  // Example: check if any token is in play or roll is 6 to come out of home
  return player.tokens.some(token => {
    if (token.position === -1 && roll === 6) return true; // can enter board
    if (token.position >= 0 && token.position + roll <= 57) return true; // normal move
    return false;
  });
}
🎮 4. On Token Click
Only allow token move if isReadyToMove is true:

javascript
Copy
Edit
canvas.addEventListener("click", function (e) {
  const player = players[currentPlayerIndex];
  if (!player.isReadyToMove) return; // do nothing

  // Check which token was clicked and move it
});
📌 Summary
isReadyToMove is a boolean for each player.

Set it after rolling the dice, depending on whether a move is legal.

Only allow token movement if this flag is true.

After a move is made, set it back to false and switch turn.
To return early if the player is not ready to move, you simply check their isReadyToMove boolean at the start of the function that handles movement (e.g., on token click or move logic), and return if it's false.

✅ Example: Token Click Handler
javascript
Copy
Edit
canvas.addEventListener("click", function (e) {
  const player = players[currentPlayerIndex];

  // ✅ Return early if not ready
  if (!player.isReadyToMove) {
    console.log(`${player.name} is not ready to move.`);
    return;
  }

  // ✅ Otherwise, continue with token selection logic
  const clickedToken = getClickedToken(e, player);
  if (clickedToken) {
    moveToken(clickedToken, player.diceValue);
    player.isReadyToMove = false; // Done with move
    nextTurn();
  }
});
📦 Inside a Function
If you're writing a movement function:

javascript
Copy
Edit
function movePlayerToken(token, player) {
  if (!player.isReadyToMove) {
    console.log("Player is not ready.");
    return; // ⛔ Exit early
  }

  // ✅ Move logic here
  token.position += player.diceValue;
  player.isReadyToMove = false;
  nextTurn();
}
🔁 Typical Turn Flow
javascript
Copy
Edit
function rollDice() {
  const player = players[currentPlayerIndex];
  const roll = Math.floor(Math.random() * 6) + 1;
  player.diceValue = roll;

  if (canMove(player, roll)) {
    player.isReadyToMove = true;
    // Highlight movable tokens
  } else {
    player.isReadyToMove = false;
    nextTurn(); // 🚀 Auto-pass if no moves
  }
}
✅ Summary
Check	Use this code
Player not ready	if (!player.isReadyToMove) return;
Player ready	Proceed with movement/token logic
how to light path point 


ChatGPT said:
To light up path points (highlight legal path steps) in your Ludo game using HTML5 Canvas, you can visually indicate which tiles a token can move to after a dice roll.

✅ Step-by-Step: How to Highlight Path Points
🧠 1. What You Need
player.diceValue — the number of steps the player can move

token.position — current position of a token on the path

fullPath[] — array of {x, y} path coordinates

A function to draw a highlight circle or glow effect on reachable positions

🔍 2. Compute Target Tile
javascript
Copy
Edit
function getTargetTile(token, steps) {
  let newPos = token.position + steps;
  if (newPos >= fullPath.length) return null; // invalid move
  return fullPath[newPos]; // returns {x, y}
}
💡 3. Draw a Highlight (Glow / Outline)
javascript
Copy
Edit
function highlightTile(ctx, x, y) {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 215, 0, 0.8)"; // gold glow
  ctx.lineWidth = 4;
  ctx.arc(x + 20, y + 20, 20, 0, Math.PI * 2); // 40x40 cell center
  ctx.stroke();
  ctx.closePath();
}
🎯 4. Highlight All Move Options
javascript
Copy
Edit
function showMoveHints(player) {
  player.tokens.forEach(token => {
    if (isMovable(token, player.diceValue)) {
      const target = getTargetTile(token, player.diceValue);
      if (target) highlightTile(ctx, target.x, target.y);
    }
  });
}
🛑 5. Clear Highlights on Next Turn
After the move or turn ends, simply re-render the board and skip drawing the hints again.

🧪 isMovable() Example
javascript
Copy
Edit
function isMovable(token, diceVal) {
  if (token.position === -1 && diceVal === 6) return true; // Can enter board
  if (token.position >= 0 && token.position + diceVal < fullPath.length) return true;
  return false;
}
📦 Example Use After Dice Roll
javascript
Copy
Edit
function onDiceRolled() {
  const player = players[currentPlayerIndex];
  player.diceValue = rollDice();
  if (canMove(player, player.diceValue)) {
    player.isReadyToMove = true;
    showMoveHints(player);
  }
}
🎨 Optional Glow Style with Shadow
javascript
Copy
Edit
ctx.shadowColor = "gold";
ctx.shadowBlur = 15;
highlightTile(ctx, x, y);
ctx.shadowBlur = 0; // Reset after drawing
✅ Summary
Feature	Description
getTargetTile	Finds the destination point
highlightTile	Draws a glow around the tile
showMoveHints	Loops through movable tokens
ctx.shadowBlur	Adds glowing visual effect (optional)
decide comon path , green path ,yellow path, red path,blue path., pink path, black path 


ChatGPT said:
To implement a full Ludo token path system (including common path and color-specific home paths for all 6 players: Green, Yellow, Red, Blue, Pink, Black), we need to structure paths using clear arrays that define the token movement order across the common board and their individual home paths.

🎯 1. Overview of Paths
Common Path (shared): All tokens start entering the same loop after leaving their base.

Color Entry Point: Each color has a unique start index on the common path.

Home Path: A color-specific path that leads into the center.

🧭 2. Standard Ludo Common Path (52 tiles)
We'll define a common array of positions [0–51] which represents the outer loop clockwise:

⬇ Common Path Indexing (clockwise starting from Green):
Color	Start Index	Enters Home at
Green	0	51 → Home Green Path
Yellow	13	12 → Home Yellow Path
Red	26	25 → Home Red Path
Blue	39	38 → Home Blue Path
Pink	6	5 → Home Pink Path
Black	20	19 → Home Black Path

🟩 3. Color-Specific Home Paths (6 tiles each)
Each player has a home path of 6 tiles starting from their entry tile in the loop.

Green: 52–57

Yellow: 58–63

Red: 64–69

Blue: 70–75

Pink: 76–81

Black: 82–87

📦 4. Structure the Full Paths in Code
javascript
Copy
Edit
const COMMON_PATH = Array.from({ length: 52 }, (_, i) => i);

const COLOR_START_INDEX = {
  green: 0,
  yellow: 13,
  red: 26,
  blue: 39,
  pink: 6,
  black: 20
};

const COLOR_HOME_ENTRY_INDEX = {
  green: 51,
  yellow: 12,
  red: 25,
  blue: 38,
  pink: 5,
  black: 19
};

const COLOR_HOME_PATH = {
  green: [52, 53, 54, 55, 56, 57],
  yellow: [58, 59, 60, 61, 62, 63],
  red: [64, 65, 66, 67, 68, 69],
  blue: [70, 71, 72, 73, 74, 75],
  pink: [76, 77, 78, 79, 80, 81],
  black: [82, 83, 84, 85, 86, 87]
};
🔁 5. Build Player Token Path
javascript
Copy
Edit
function getPlayerPath(color) {
  const start = COLOR_START_INDEX[color];
  const beforeWrap = COMMON_PATH.slice(start);
  const afterWrap = COMMON_PATH.slice(0, start);
  return [...beforeWrap, ...afterWrap, ...COLOR_HOME_PATH[color]];
}
🧪 6. Example Use
javascript
Copy
Edit
const redPath = getPlayerPath("red");
// redPath will be [26,27,...,51,0,...,25,64,65,...,69]
🗺 7. Mapping to Coordinates (Optional)
Once your full path array is built, you'll want to map each path index to a coordinate (x, y) on your canvas:

javascript
Copy
Edit
const PATH_COORDS = {
  0: { x: 100, y: 400 },
  1: { x: 100, y: 360 },
  // ... continue until index 87
};
Then access them using:

javascript
Copy
Edit
const pos = PATH_COORDS[playerPath[token.position]];
✅ Summary
Path Type	Length	Purpose
Common Path	52	Shared clockwise movement
Home Path	6	Unique final steps to center
getPlayerPath	Builds full movement path per player	

how to to rolling dice animation


ChatGPT said:
Creating a rolling dice animation in pure HTML5, CSS3, and JavaScript involves simulating a dice roll with a visual spinning or rotating cube, then stopping on the result.

Here’s a simple approach to create a 3D dice rolling animation:

🎲 How to Make a Rolling Dice Animation
1. Create a 3D Dice Cube with CSS
Use a cube made from 6 faces with numbers 1-6.

html
Copy
Edit
<div id="dice-container">
  <div id="dice">
    <div class="face one">1</div>
    <div class="face two">2</div>
    <div class="face three">3</div>
    <div class="face four">4</div>
    <div class="face five">5</div>
    <div class="face six">6</div>
  </div>
</div>
2. CSS to Style and Position Dice Faces
css
Copy
Edit
#dice-container {
  perspective: 600px;
  width: 100px;
  height: 100px;
  margin: 20px auto;
}

#dice {
  width: 100px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1s ease-out;
}

.face {
  position: absolute;
  width: 100px;
  height: 100px;
  background: white;
  border: 2px solid #333;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  text-align: center;
  line-height: 100px;
  user-select: none;
}

/* Position each face */
.face.one   { transform: rotateY(0deg) translateZ(50px); }
.face.two   { transform: rotateY(90deg) translateZ(50px); }
.face.three { transform: rotateX(90deg) translateZ(50px); }
.face.four  { transform: rotateX(-90deg) translateZ(50px); }
.face.five  { transform: rotateY(180deg) translateZ(50px); }
.face.six   { transform: rotateY(-90deg) translateZ(50px); }
3. JavaScript to Rotate Dice
You animate the dice by changing the transform property of the #dice div to simulate rolling and then stop it on the rolled number.

js
Copy
Edit
const dice = document.getElementById('dice');

const rotations = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(0deg) rotateY(-90deg)',
  3: 'rotateX(90deg) rotateY(0deg)',
  4: 'rotateX(-90deg) rotateY(0deg)',
  5: 'rotateX(0deg) rotateY(180deg)',
  6: 'rotateX(0deg) rotateY(90deg)'
};

function rollDice() {
  // Simulate fast spinning
  dice.style.transition = 'transform 0.1s linear';
  let spinTimes = 10;
  let spinCount = 0;

  function spin() {
    const randX = Math.floor(Math.random() * 360);
    const randY = Math.floor(Math.random() * 360);
    dice.style.transform = `rotateX(${randX}deg) rotateY(${randY}deg)`;
    spinCount++;
    if (spinCount < spinTimes) {
      setTimeout(spin, 100);
    } else {
      showResult();
    }
  }

  function showResult() {
    const result = Math.floor(Math.random() * 6) + 1;
    dice.style.transition = 'transform 1s ease-out';
    dice.style.transform = rotations[result];
    console.log("Dice rolled:", result);
    // TODO: Pass result to game logic
  }

  spin();
}

dice.addEventListener('click', rollDice);
4. How it Works
On click, dice spins randomly with quick transitions.

After 10 spins (1 second), it smoothly stops on the face matching the random roll.

The result can then be used in your game logic.

5. Improvement Ideas
Add sound effects for dice roll.

Disable clicking while rolling.

Show rolling text or highlight.

how to create time hold and create i numerator 


ChatGPT said:
Got it! You want to:

Create a time hold (a delay or pause in code execution)

Create a numerator (likely a counter or incremental variable)

Here’s how to do both in JavaScript simply:

1. Creating a Time Hold (Delay)
JavaScript is asynchronous, so you don't block the main thread, but you can delay execution using:

a) setTimeout — runs code after delay
js
Copy
Edit
console.log("Before delay");

setTimeout(() => {
  console.log("After 2 seconds delay");
}, 2000); // 2000 ms = 2 seconds
b) async/await with Promise — pause inside async functions
js
Copy
Edit
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
  console.log("Before delay");
  await delay(2000); // wait 2 seconds
  console.log("After 2 seconds delay");
}

example();
2. Creating a Numerator (Counter)
If you want to create a variable that increments over time or on events, you can do:

js
Copy
Edit
let numerator = 0;

function increment() {
  numerator++;
  console.log("Numerator value:", numerator);
}

// Call increment every second
setInterval(increment, 1000);
Or increment inside a loop or event, e.g., each dice roll:

js
Copy
Edit
let rollCount = 0;

function rollDice() {
  rollCount++;
  console.log("Roll number:", rollCount);
  // dice rolling logic here...
}
Example: Combined — delay then increment numerator
js
Copy
Edit
let numerator = 0;

async function incrementWithDelay() {
  while (numerator < 5) {
    console.log("Count:", numerator);
    numerator++;
    await new Promise(r => setTimeout(r, 1000)); // wait 1 sec between counts
  }
  console.log("Done counting");
}

incrementWithDelay();
how to animate a roll dice 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Dice Roller</title>
    <style>
        /* Global reset and base styles */
        html, body {
            height: 100%;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            line-height: 1.6;
            background-color: #f0f2f5; /* Light grey background for the page */
            color: #333;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 15px; /* Padding for small screens */
            box-sizing: border-box;
        }

        /* Main container for the dice app */
        .dice-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 25px; /* Space between elements */
            padding: clamp(20px, 5vw, 40px); /* Responsive padding */
            background-color: #ffffff; /* White card background */
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 380px; /* Max width for the container */
        }

        /* Area displaying the die face */
        #dice-area {
            width: clamp(100px, 30vmin, 150px); /* Responsive size based on viewport smaller dimension */
            height: clamp(100px, 30vmin, 150px);
            border: 3px solid #4A5568; /* A slightly muted dark border for the die */
            background-color: #F7FAFC; /* Very light grey for die face */
            border-radius: clamp(10px, 4vmin, 20px); /* Responsive border radius for die */
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px; /* Padding for the SVG inside */
            box-shadow: inset 0 0 8px rgba(0,0,0,0.1); /* Inner shadow for depth */
        }

        #dice-svg {
            width: 100%;
            height: 100%;
        }

        /* Text displaying the roll result */
        #roll-result-text {
            font-size: clamp(1.125rem, 4vw, 1.5rem); /* Approx 18px to 24px */
            font-weight: 600; /* Semi-bold */
            color: #2D3748; /* Dark grey text */
            min-height: 1.6em; /* Prevent layout shift, matches line-height */
            margin: 0;
        }

        /* The "Roll the Dice!" button */
        #roll-dice-button {
            padding: 12px 24px;
            font-size: clamp(1rem, 3.5vw, 1.125rem); /* Approx 16px to 18px */
            font-weight: bold; /* Bold for better readability and presence */
            color: #ffffff;
            background-color: #0053b3; /* Accessible blue (WCAG AA 5.76:1) */
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, transform 0.1s ease;
            min-width: 200px; /* Ensure button has a good minimum width */
        }

        #roll-dice-button:hover:not(:disabled) {
            background-color: #00428F; /* Darker blue on hover */
        }

        #roll-dice-button:active:not(:disabled) {
            transform: translateY(1px); /* Slight press down effect */
        }

        #roll-dice-button:disabled {
            background-color: #A0AEC0; /* Muted grey when disabled */
            cursor: not-allowed;
        }

    </style>
</head>
<body>
    <div class="dice-container">
        <div id="dice-area">
            <svg id="dice-svg" viewBox="0 0 100 100" aria-labelledby="dice-title-desc" role="img">
                <title id="dice-title-desc">Die face showing a 1</title>
                <g id="pips-group">
                    <!-- Initial pips for 1 -->
                    <circle cx="50" cy="50" r="8" fill="#1A202C"/>
                </g>
            </svg>
        </div>
        <p id="roll-result-text" aria-live="polite">Let's roll the dice!</p>
        <button id="roll-dice-button">Roll the Dice!</button>
    </div>

    <script>
        const pipsGroupElement = document.getElementById('pips-group');
        const diceTitleDescElement = document.getElementById('dice-title-desc');
        const rollResultTextElement = document.getElementById('roll-result-text');
        const rollDiceButtonElement = document.getElementById('roll-dice-button');

        // Pip positions for each die face number (1-6)
        // Coordinates are for a 100x100 viewBox
        const pipPatterns = {
            1: [{ x: 50, y: 50 }],
            2: [{ x: 30, y: 30 }, { x: 70, y: 70 }],
            3: [{ x: 30, y: 30 }, { x: 50, y: 50 }, { x: 70, y: 70 }],
            4: [{ x: 30, y: 30 }, { x: 70, y: 30 }, { x: 30, y: 70 }, { x: 70, y: 70 }],
            5: [{ x: 30, y: 30 }, { x: 70, y: 30 }, { x: 50, y: 50 }, { x: 30, y: 70 }, { x: 70, y: 70 }],
            6: [
                { x: 30, y: 30 }, { x: 70, y: 30 },
                { x: 30, y: 50 }, { x: 70, y: 50 },
                { x: 30, y: 70 }, { x: 70, y: 70 }
            ]
        };
        const pipRadius = 8; // Radius of each pip
        const pipColor = "#1A202C"; // Dark color for pips (e.g., Tailwind's gray.800)

        let isRolling = false;

        // Function to generate SVG for pips based on the number
        function getDieFacePipsSVG(number) {
            if (!pipPatterns[number]) {
                console.error("Invalid number for die face:", number);
                return ''; 
            }

            const pipsData = pipPatterns[number];
            return pipsData.map(pip => 
                `<circle cx="${pip.x}" cy="${pip.y}" r="${pipRadius}" fill="${pipColor}"/>`
            ).join('');
        }

        // Function to update the die face visually and its accessible title
        function updateDieFace(number) {
            pipsGroupElement.innerHTML = getDieFacePipsSVG(number);
            diceTitleDescElement.textContent = `Die face showing a ${number}`;
        }
        
        // Handle the dice roll
        function handleRollDice() {
            if (isRolling) return;

            isRolling = true;
            rollDiceButtonElement.disabled = true;
            rollResultTextElement.textContent = 'Rolling...';

            const animationDuration = 1500; // Total animation time in ms
            const animationIntervalTime = 100; // Interval time for changing faces in ms
            let elapsed = 0;

            const animationInterval = setInterval(() => {
                const randomFace = Math.floor(Math.random() * 6) + 1;
                updateDieFace(randomFace);
                elapsed += animationIntervalTime;
                if (elapsed >= animationDuration) {
                    clearInterval(animationInterval);
                    displayFinalResult();
                }
            }, animationIntervalTime);
        }

        function displayFinalResult() {
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            updateDieFace(finalRoll);
            rollResultTextElement.textContent = `You rolled a ${finalRoll}!`;
            
            isRolling = false;
            rollDiceButtonElement.disabled = false;
        }

        // Attach event listener to the button
        rollDiceButtonElement.addEventListener('click', handleRollDice);

    </script>
</body>
</html>



