// board_renderer.js: Responsible for drawing the Ludo board

const BoardRenderer = {
    boardElement: null,
    tileElements: [], // To store references to tile DOM elements

    init: function(boardContainerId = "game-board-area") {
        this.boardElement = Utils.$(boardContainerId);
        if (!this.boardElement) {
            console.error(`Board container with id "${boardContainerId}" not found.`);
            return;
        }
        this.boardElement.innerHTML = "; // Clear previous board
        this.tileElements = [];
        this._createBoardGrid();
        console.log("BoardRenderer initialized and board grid created.");
    },

    _createBoardGrid: function() {
        const dim = CONFIG.BOARD_DIMENSIONS; // e.g., 15x15
        this.boardElement.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${dim}, 1fr)`;

        // Define the Ludo path and home areas based on a 15x15 grid
        // This is a simplified representation. A more detailed mapping is needed.
        // For a standard Ludo board on a 15x15 grid:
        // - Outer paths are 6 tiles long on each arm, 2 tiles wide.
        // - Center square is 3x3.
        // - Home stretches are 6 tiles long, 1 tile wide.

        const layout = this._getBoardLayout(dim);

        for (let r = 0; r < dim; r++) {
            for (let c = 0; c < dim; c++) {
                const tileData = layout[r][c];
                const tileDiv = Utils.createElement("div", "tile");
                tileDiv.dataset.row = r;
                tileDiv.dataset.col = c;
                tileDiv.dataset.type = tileData.type;

                if (tileData.type === "empty") {
                    tileDiv.classList.add("tile-empty");
                } else {
                    tileDiv.style.backgroundColor = tileData.color || "#ccc"; // Default path color
                    if (tileData.isSafe) {
                        tileDiv.classList.add("tile-safe");
                        // Add a star or other visual indicator for safe zones
                        tileDiv.innerHTML = "<span>★</span>"; 
                    }
                    if (tileData.isArrow) {
                        tileDiv.classList.add("tile-arrow");
                        // Add arrow indicator
                        tileDiv.innerHTML = "<span>➔</span>"; 
                    }
                    if (tileData.isHomeEntry) {
                         tileDiv.classList.add(`tile-home-entry-${tileData.playerColor}`);
                    }
                    if (tileData.isHomeBase) {
                         tileDiv.classList.add(`tile-home-base-${tileData.playerColor}`);
                         tileDiv.style.border = `2px solid ${CONFIG.PLAYER_COLORS[tileData.playerColor].hex}`;
                    }
                     if (tileData.isHomeStretch) {
                         tileDiv.classList.add(`tile-home-stretch-${tileData.playerColor}`);
                         tileDiv.style.backgroundColor = CONFIG.PLAYER_COLORS[tileData.playerColor].hex; // Color home stretch
                         tileDiv.style.opacity = 0.7;
                    }
                    if (tileData.isCenterGoal) {
                        tileDiv.classList.add("tile-center-goal");
                    }
                    if (tileData.pathIndex !== undefined) {
                        tileDiv.dataset.pathIndex = tileData.pathIndex;
                        // tileDiv.textContent = tileData.pathIndex; // For debugging path indices
                    }
                }
                this.boardElement.appendChild(tileDiv);
                this.tileElements.push(tileDiv);
            }
        }
    },

    // This is a complex part: defining the Ludo board layout programmatically
    // This function needs to map each cell (r, c) of the 15x15 grid to its type and properties.
    _getBoardLayout: function(dim = 15) {
        const layout = Array(dim).fill(null).map(() => Array(dim).fill(null).map(() => ({ type: "empty", color: "#ffffff" })));

        // Helper to set a region
        const setRegion = (r, c, h, w, type, playerColor = null, baseColor = "#ddd") => {
            for (let i = r; i < r + h; i++) {
                for (let j = c; j < c + w; j++) {
                    if (i < dim && j < dim) {
                        layout[i][j] = { type: type, color: baseColor, playerColor: playerColor };
                    }
                }
            }
        };

        // Home Bases (4x4 squares in corners, actual yard is 2x2 within this)
        setRegion(0, 0, 6, 6, "home-base-area", "red", CONFIG.PLAYER_COLORS.red.hex); // Red area
        setRegion(0, 9, 6, 6, "home-base-area", "blue", CONFIG.PLAYER_COLORS.blue.hex); // Blue area
        setRegion(9, 0, 6, 6, "home-base-area", "green", CONFIG.PLAYER_COLORS.green.hex); // Green area
        setRegion(9, 9, 6, 6, "home-base-area", "yellow", CONFIG.PLAYER_COLORS.yellow.hex); // Yellow area
        
        // Actual Yards within Home Bases (e.g. 2x2 or larger for token display)
        // These are logical areas, tokens will be placed by TokenRenderer
        // For simplicity, we mark the base area, TokenRenderer will handle exact yard spots.
        layout[1][1].isHomeBase = true; layout[1][1].playerColor = "red"; // Red yard center (example)
        layout[1][10].isHomeBase = true; layout[1][10].playerColor = "blue";
        layout[10][1].isHomeBase = true; layout[10][1].playerColor = "green";
        layout[10][10].isHomeBase = true; layout[10][10].playerColor = "yellow";


        // Center Goal Area (3x3)
        setRegion(6, 6, 3, 3, "center-goal-area", null, "#bfbfbf");
        layout[7][7].isCenterGoal = true; // Center of the goal

        // Paths (these are the coordinates for the path tiles)
        // Path is 1-indexed for easier mapping from traditional Ludo boards
        const pathCoords = [
            // Red arm (leading to green)
            {r:6, c:0}, {r:6, c:1}, {r:6, c:2}, {r:6, c:3}, {r:6, c:4}, {r:6, c:5}, // 0-5
            {r:5, c:6}, {r:4, c:6}, {r:3, c:6}, {r:2, c:6}, {r:1, c:6}, {r:0, c:6}, // 6-11
            {r:0, c:7}, // Turn into Green area (12)
            // Green arm (leading to yellow)
            {r:0, c:8}, {r:1, c:8}, {r:2, c:8}, {r:3, c:8}, {r:4, c:8}, {r:5, c:8}, // 13-18
            {r:6, c:9}, {r:6, c:10}, {r:6, c:11}, {r:6, c:12}, {r:6, c:13}, {r:6, c:14}, // 19-24
            {r:7, c:14}, // Turn into Yellow area (25)
            // Yellow arm (leading to blue)
            {r:8, c:14}, {r:8, c:13}, {r:8, c:12}, {r:8, c:11}, {r:8, c:10}, {r:8, c:9}, // 26-31
            {r:9, c:8}, {r:10, c:8}, {r:11, c:8}, {r:12, c:8}, {r:13, c:8}, {r:14, c:8}, // 32-37
            {r:14, c:7}, // Turn into Blue area (38)
            // Blue arm (leading to red)
            {r:14, c:6}, {r:13, c:6}, {r:12, c:6}, {r:11, c:6}, {r:10, c:6}, {r:9, c:6}, // 39-44
            {r:8, c:5}, {r:8, c:4}, {r:8, c:3}, {r:8, c:2}, {r:8, c:1}, {r:8, c:0}, // 45-50
            {r:7, c:0}  // Turn into Red area (51)
        ];

        pathCoords.forEach((coord, index) => {
            layout[coord.r][coord.c] = {
                type: "path",
                color: "#ffffff", // White path tiles
                pathIndex: index,
                isSafe: CONFIG.SAFE_ZONE_INDICES.includes(index),
                isArrow: CONFIG.ARROW_TILES.some(at => at.index === index)
            };
            // Mark player start tiles with their color
            Object.keys(CONFIG.START_TILE_INDICES).forEach(playerColor => {
                if (CONFIG.START_TILE_INDICES[playerColor] === index) {
                    layout[coord.r][coord.c].color = CONFIG.PLAYER_COLORS[playerColor].hex;
                    layout[coord.r][coord.c].isStart = true;
                    layout[coord.r][coord.c].playerColor = playerColor;
                }
            });
        });

        // Home Stretches
        // Red home stretch
        for (let i = 0; i < CONFIG.HOME_STRETCH_LENGTH; i++) layout[7][1+i] = { type: "home-stretch", playerColor: "red", color: CONFIG.PLAYER_COLORS.red.hex, isHomeStretch: true, homeStretchIndex: i };
        // Green home stretch
        for (let i = 0; i < CONFIG.HOME_STRETCH_LENGTH; i++) layout[1+i][7] = { type: "home-stretch", playerColor: "green", color: CONFIG.PLAYER_COLORS.green.hex, isHomeStretch: true, homeStretchIndex: i };
        // Yellow home stretch
        for (let i = 0; i < CONFIG.HOME_STRETCH_LENGTH; i++) layout[7][13-i] = { type: "home-stretch", playerColor: "yellow", color: CONFIG.PLAYER_COLORS.yellow.hex, isHomeStretch: true, homeStretchIndex: i };
        // Blue home stretch
        for (let i = 0; i < CONFIG.HOME_STRETCH_LENGTH; i++) layout[13-i][7] = { type: "home-stretch", playerColor: "blue", color: CONFIG.PLAYER_COLORS.blue.hex, isHomeStretch: true, homeStretchIndex: i };

        return layout;
    },

    // Method to get the DOM element for a specific tile (e.g., by pathIndex or homeStretchIndex)
    getTileElementByPathIndex: function(pathIndex) {
        return this.boardElement.querySelector(`.tile[data-path-index="${pathIndex}"]`);
    },
    
    getTileElementByCoords: function(row, col) {
        return this.boardElement.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
    }

    // Add more methods as needed, e.g., to highlight tiles, etc.
};

// Make BoardRenderer globally accessible (if not using modules)
// window.BoardRenderer = BoardRenderer; // Or export default BoardRenderer; if using modules
