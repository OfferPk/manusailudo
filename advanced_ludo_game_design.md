# Advanced Ludo Game - Architectural Design Document

## 1. Introduction

This document outlines the redesigned architecture for the "Ultimate Ludo Game," aiming to incorporate advanced UI/UX features inspired by popular games like Yalla Ludo and Ludo Star, while building upon the foundational design previously established.

## 2. Core Design Philosophy

*   **User-Centric:** Prioritize intuitive navigation, clear feedback, and an enjoyable user experience.
*   **Visually Rich & Engaging:** Emulate the vibrant and dynamic feel of games like Yalla Ludo.
*   **Modular & Scalable:** Structure the code to allow for easier addition of new features (e.g., more game modes, power-ups, social features).
*   **Performance-Oriented:** Ensure smooth animations and responsive gameplay, especially on mobile devices, despite being a web-based application.

## 3. Overall Application Structure (Single HTML Page with Dynamic Content)

The game will remain a single HTML file (`advanced_ludo.html`) but will dynamically show/hide and populate different "screens" or views using JavaScript.

### 3.1. Main Screens/Views:

1.  **Loading Screen (New):**
    *   Purpose: Display while initial assets and scripts are loading.
    *   Elements: Game logo, progress bar/animation.
2.  **Player Selection Screen (Revised):**
    *   Purpose: Select number of players (2 or 4) and potentially game mode if not selected on a dedicated home screen button.
    *   Elements: Clear buttons for player count, perhaps color selection previews.
3.  **Home Screen (New - Yalla Ludo Inspired):
    *   Purpose: Main navigation hub, game mode selection, access to social features, shop, settings.
    *   Structure:
        *   **Top Bar:** Player Profile (Avatar, Name, Level - placeholder initially), Currencies (Gold, Diamonds - placeholder initially).
        *   **Main Navigation:** Large, clear buttons for:
            *   Play with Friends (Online/Private Room)
            *   Play Online (Random Matchmaking)
            *   Play with Computer (AI)
            *   Tournaments (Future Scope)
        *   **Side/Bottom Bar:** Buttons for:
            *   Shop (Cosmetics, Power-ups - Future Scope)
            *   Leaderboards
            *   Settings
            *   Daily Rewards/Events
4.  **Game Table Screen (Revised):
    *   Purpose: The actual Ludo gameplay area.
    *   Structure:
        *   **Main Board Area:** Visually appealing Ludo board, player tokens, dice.
        *   **Player Info HUDs:** Display for each player (Avatar, Name, Tokens Home/Finished).
        *   **Controls Area:** Roll Dice button, Power-up activation (if applicable).
        *   **In-Game Chat/Emotes:** (Yalla Ludo style - quick emotes, predefined messages).
        *   **Game Menu Button:** (Pause, Settings, Exit to Home).
5.  **Settings Screen (Revised):
    *   Purpose: Game settings.
    *   Elements: Sound On/Off, Music On/Off, How to Play, Account (Logout if applicable), Language Selection.

### 3.2. Core JavaScript Modules (Revised & Expanded from `Ultimate Ludo Game: Design Document`):

*   **`main.js`**: Entry point. Initializes the game, manages screen transitions, and orchestrates other modules.
*   **`config.js`**: Game constants, board layout data, color schemes, default settings, API endpoints (if any for future online features).
*   **`assets_manager.js`**: Handles loading and caching of all game assets (images, sounds, fonts). Displays loading screen progress.
*   **`state_manager.js`**: Manages the overall application state, including current screen, game state (if a game is active), player data, settings. Could use a simple object or a more formal state management pattern.
*   **`ui_manager.js`**: Responsible for all DOM manipulations. Showing/hiding screens, updating text, handling button clicks (delegating actions to other modules). This module will be central to creating the dynamic UI.
    *   `renderHomeScreen()`
    *   `renderPlayerSelectionScreen()`
    *   `renderGameTableScreen()`
    *   `renderSettingsScreen()`
    *   `updatePlayerHUD()`
    *   `showNotification()` / `showModal()`
*   **`home_screen_manager.js` (New):** Handles logic specific to the Home Screen (e.g., button actions like "Play Online" which would then trigger `state_manager` and `ui_manager` to transition to player selection or matchmaking).
*   **`game_logic.js`**: Core Ludo rules engine. Independent of UI.
    *   Player turns, dice rolls (generating random numbers).
    *   Token movement validation (can move, which tokens can move, where).
    *   Capture logic.
    *   Safe zone logic.
    *   Home path logic.
    *   Win condition checking.
    *   (Future) Power-up effects application.
*   **`board_renderer.js`**: Draws the Ludo board on a `<canvas>` element or constructs it with DOM elements (Canvas preferred for complex graphics/animations).
    *   Draws base board, paths, safe zones, home areas.
*   **`token_renderer.js`**: Draws and animates player tokens on the board. Updates token positions based on `game_logic.js`.
*   **`dice_renderer.js`**: Displays the dice, handles dice roll animation (e.g., animated 3D dice or sequence of images).
*   **`game_table_manager.js` (New/Revised):** Orchestrates the game screen. Initializes `board_renderer`, `token_renderer`, `dice_renderer`. Handles player input for dice rolls and token selection, passing it to `game_logic.js`. Updates UI elements on the game table via `ui_manager.js` based on `game_logic.js` outcomes.
*   **`sound_manager.js` (New):** Manages playing sound effects and background music. Provides functions like `playSound("dice_roll")`, `playMusic("background_theme")`, `setVolume()`.
*   **`api_service.js` (Future - for Online Play):** Handles communication with a backend server for multiplayer features (matchmaking, game state sync, chat).
*   **`storage_manager.js` (New):** Handles saving and loading game data to/from `localStorage` (e.g., player preferences, offline progress, unlocked items).

## 4. UI/UX Enhancements (Yalla Ludo / Ludo Star Inspired)

*   **Dynamic Backgrounds & Themes:** Allow for visually distinct themes for the home screen and game board.
*   **Animated Transitions:** Smooth screen transitions (e.g., fades, slides).
*   **Interactive Elements:** Buttons with hover/click effects, satisfying visual feedback.
*   **Player Avatars & Customization:** Allow players to choose/upload avatars. Display prominently.
*   **In-Game Emotes/Quick Chat:** Predefined messages or graphical emotes for quick communication.
*   **Celebratory Animations:** For winning, capturing tokens, rolling a six.
*   **Clear Turn Indicators:** Visually highlight whose turn it is.
*   **Power-up Visuals:** Clear icons and effects when power-ups are used.
*   **Tutorial/Help System:** Interactive tutorial for new players accessible from settings or on first launch.

## 5. Key Data Structures

*   **`gameState` (managed by `state_manager.js` and `game_logic.js`):
    ```javascript
    {
        currentPlayerIndex: 0, // Index in players array
        diceValue: null,
        rolledSix: false,
        players: [
            {
                id: "player1",
                color: "red",
                avatar: "path/to/avatar.png",
                name: "Player 1",
                tokens: [
                    { id: 0, position: -1, state: "home" }, // position: -1 for home, 0-51 for board, 52-57 for home path
                    { id: 1, position: -1, state: "home" },
                    { id: 2, position: -1, state: "home" },
                    { id: 3, position: -1, state: "home" }
                ],
                tokensFinished: 0
            },
            // ... other players
        ],
        boardLayout: { /* ... data for tile positions, safe zones, etc. from config.js ... */ },
        gameMode: "classic", // or "arrow_mode", "quick_mode"
        isGameOver: false,
        winner: null
    }
    ```
*   **`playerProfile` (managed by `state_manager.js` and `storage_manager.js`):
    ```javascript
    {
        playerName: "Guest",
        avatarUrl: "assets/images/default_avatar.png",
        coins: 1000,
        gems: 50,
        stats: {
            gamesPlayed: 0,
            wins: 0,
            // ... other stats
        },
        settings: {
            soundVolume: 0.8,
            musicVolume: 0.5
        }
    }
    ```

## 6. Event Flow Example (Rolling Dice):

1.  **User Action:** Player clicks "Roll Dice" button (`ui_manager.js` detects click).
2.  **Input Handling:** `ui_manager.js` calls a function in `game_table_manager.js`.
3.  **Logic Execution:** `game_table_manager.js` requests a dice roll from `game_logic.js`.
4.  **Dice Roll:** `game_logic.js` generates a random number (1-6), updates `gameState.diceValue`.
5.  **Animation:** `game_table_manager.js` tells `dice_renderer.js` to play the dice roll animation and display the result.
6.  **Sound:** `game_table_manager.js` tells `sound_manager.js` to play "dice_roll.mp3".
7.  **Game Logic Update:** `game_logic.js` determines valid moves based on the dice roll and current player tokens.
8.  **UI Update:** `game_table_manager.js` (or `game_logic.js` via callbacks) informs `ui_manager.js` to highlight movable tokens.
9.  **State Update:** `state_manager.js` ensures the global `gameState` is consistent.

## 7. Asset Requirements (Initial List - to be expanded)

*   **UI Elements:** Buttons (various styles), icons (settings, shop, chat, etc.), avatars, currency icons.
*   **Game Board:** Multiple themes for the board itself.
*   **Tokens:** Different colors, potentially customizable skins.
*   **Dice:** Animated dice graphics (spritesheet or 3D model if ambitious).
*   **Power-up Icons & Effects.**
*   **Sound Effects:** Dice roll, token move, token capture, win/lose jingles, button clicks, power-up activation.
*   **Background Music:** For home screen and in-game.

## 8. Potential Challenges & Mitigations

*   **Performance with DOM manipulation:** Minimize direct DOM updates. Use `<canvas>` for board/tokens if performance becomes an issue. Batch DOM updates where possible.
*   **Complex Game Logic:** Thoroughly test `game_logic.js` with unit tests.
*   **Asset Loading Times:** Optimize assets, use `assets_manager.js` for preloading and progress display.
*   **Responsive Design:** Use CSS flexbox/grid, relative units, and test on various screen sizes. The `user-scalable=no` viewport tag helps, but careful CSS is key.

## 9. Next Steps (Development Order)

1.  **Basic HTML Structure & CSS Styling:** Create `advanced_ludo.html` with all screen divs and basic CSS for layout.
2.  **Module Scaffolding:** Create all `.js` files with initial class/function definitions.
3.  **`main.js`, `state_manager.js`, `ui_manager.js` (Screen Transitions):** Implement basic screen switching.
4.  **`assets_manager.js` & Loading Screen:** Implement asset loading and display.
5.  **`home_screen_manager.js` & Home Screen UI:** Build out the home screen.
6.  **`config.js` & Core `game_logic.js`:** Define board layout and implement fundamental Ludo rules (dice roll, basic movement).
7.  **`board_renderer.js`, `token_renderer.js`, `dice_renderer.js`:** Basic rendering of board, tokens, dice.
8.  **`game_table_manager.js`:** Integrate game logic with rendering for a playable (but basic) game.
9.  **Refine UI/UX:** Add animations, sound effects (`sound_manager.js`), better visuals.
10. **Advanced Features:** Implement power-ups, different game modes, AI opponents.
11. **(Future) Online Multiplayer.**

This architectural design provides a more detailed roadmap for building a feature-rich Ludo game with an enhanced user experience.
