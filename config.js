// config.js: Game constants and initial settings

const CONFIG = {
    PLAYER_COLORS: {
        red:    { hex: "#e74c3c", name: "Red" },
        green:  { hex: "#2ecc71", name: "Green" },
        yellow: { hex: "#f1c40f", name: "Yellow" },
        blue:   { hex: "#3498db", name: "Blue" }
    },
    TOKENS_PER_PLAYER: 4,
    BOARD_DIMENSIONS: 15, 
    PATH_LENGTH: 52, 
    HOME_STRETCH_LENGTH: 6, 
    START_TILE_INDICES: {
        red: 0,    
        green: 13, 
        yellow: 26, 
        blue: 39   
    },
    HOME_STRETCH_ENTRY_INDICES: {
        red: 50,    
        green: 11,  
        yellow: 24, 
        blue: 37   
    },
    SAFE_ZONE_INDICES: [
        0, 8, 13, 21, 26, 34, 39, 47 
    ],
    ARROW_TILES: [],
    ANIMATION_SPEEDS: {
        tokenMove: 200, 
        diceRoll: 500   
    },
    PATH_COORDINATES: [
        {r:6, c:0}, {r:6, c:1}, {r:6, c:2}, {r:6, c:3}, {r:6, c:4}, {r:6, c:5}, 
        {r:5, c:6}, {r:4, c:6}, {r:3, c:6}, {r:2, c:6}, {r:1, c:6}, {r:0, c:6}, 
        {r:0, c:7}, 
        {r:0, c:8}, {r:1, c:8}, {r:2, c:8}, {r:3, c:8}, {r:4, c:8}, {r:5, c:8}, 
        {r:6, c:9}, {r:6, c:10}, {r:6, c:11}, {r:6, c:12}, {r:6, c:13}, {r:6, c:14}, 
        {r:7, c:14}, 
        {r:8, c:14}, {r:8, c:13}, {r:8, c:12}, {r:8, c:11}, {r:8, c:10}, {r:8, c:9}, 
        {r:9, c:8}, {r:10, c:8}, {r:11, c:8}, {r:12, c:8}, {r:13, c:8}, {r:14, c:8}, 
        {r:14, c:7}, 
        {r:14, c:6}, {r:13, c:6}, {r:12, c:6}, {r:11, c:6}, {r:10, c:6}, {r:9, c:6}, 
        {r:8, c:5}, {r:8, c:4}, {r:8, c:3}, {r:8, c:2}, {r:8, c:1}, {r:8, c:0}, 
        {r:7, c:0}  
    ],
    HOME_STRETCH_COORDINATES: {
        red:    [{r:7, c:1}, {r:7, c:2}, {r:7, c:3}, {r:7, c:4}, {r:7, c:5}, {r:7, c:6}],
        green:  [{r:1, c:7}, {r:2, c:7}, {r:3, c:7}, {r:4, c:7}, {r:5, c:7}, {r:6, c:7}],
        yellow: [{r:7, c:13}, {r:7, c:12}, {r:7, c:11}, {r:7, c:10}, {r:7, c:9}, {r:7, c:8}],
        blue:   [{r:13, c:7}, {r:12, c:7}, {r:11, c:7}, {r:10, c:7}, {r:9, c:7}, {r:8, c:7}]
    },
    LOCAL_STORAGE_GAME_KEY: "ludoGameState",
    LOCAL_STORAGE_SETTINGS_KEY: "ludoGameSettings",
    ALLOW_OFFLINE_MULTIPLAYER_STUB: true, 
    MUSIC_VOLUME: 0.5, 
    ASSETS: {
        IMAGES: {
            dice1: "assets/images/cosmic_dice.png",
            dice2: "assets/images/cosmic_dice.png",
            dice3: "assets/images/cosmic_dice.png",
            dice4: "assets/images/cosmic_dice.png",
            dice5: "assets/images/cosmic_dice.png",
            dice6: "assets/images/cosmic_dice.png",
            playerAvatarDefault: "assets/images/avatar_default.png",
            coinIcon: "assets/images/coin_icon.png",
            diamondIcon: "assets/images/diamond_icon.png",
            redToken: "assets/images/cosmic_red_token.png", 
            greenToken: "assets/images/cosmic_green_token.png",
            yellowToken: "assets/images/cosmic_yellow_token.png",
            blueToken: "assets/images/cosmic_blue_token.png",
            boardImage: "assets/images/cosmic_ludo_board.png",
            homeScreenBg: "assets/images/home_bg.jpg" // This might need a cosmic theme too, or be removed if not used
        },
        SOUNDS: {
            diceRoll: "assets/sounds/dice_roll.mp3",
            tokenMove: "assets/sounds/token_move.wav", 
            tokenCapture: "assets/sounds/capture.wav", 
            gameWin: "assets/sounds/win.mp3",
            buttonClick: "assets/sounds/button_click.mp3"
        },
        MUSIC: {
            backgroundMusic: "assets/music/bg_loop.mp3"
        },
        PLACEHOLDERS: {
            IMAGE: "playerAvatarDefault"
        }
    }
};


// If not using ES6 modules, you might attach it to window or a global game object:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.CONFIG = CONFIG;
