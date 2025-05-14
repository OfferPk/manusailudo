// board_renderer.js: Responsible for drawing the Ludo board

const BoardRenderer = {
    boardElement: null,
    tileElements: [], // To store references to tile DOM elements

    init: function(boardContainerId = "game-board-area") {
        this.boardElement = document.getElementById(boardContainerId); // Assuming Utils.$ is similar to document.getElementById
        if (!this.boardElement) {
            console.error(`Board container with id "${boardContainerId}" not found.`);
            return;
        }
        this.boardElement.innerHTML = ""; // Clear previous board
        this.tileElements = [];
        this._createBoardGrid();
        console.log("BoardRenderer initialized and board grid created.");
    },

    _createBoardGrid: function() {
        const dim = CONFIG.BOARD_DIMENSIONS; // e.g., 15x15
        this.boardElement.style.display = "grid"; // Ensure it's a grid container
        this.boardElement.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${dim}, 1fr)`;

        const layout = this._getBoardLayout(dim);

        for (let r = 0; r < dim; r++) {
            for (let c = 0; c < dim; c++) {
                const tileData = layout[r][c];
                const tileDiv = document.createElement("div"); // Assuming Utils.createElement is document.createElement
                tileDiv.classList.add("tile");
                tileDiv.dataset.row = r;
                tileDiv.dataset.col = c;
                tileDiv.dataset.type = tileData.type;

                if (tileData.type === "empty") {
                    tileDiv.classList.add("tile-empty");
                } else {
                    tileDiv.style.backgroundColor = tileData.color || "#ccc"; // Default path color
                    if (tileData.isSafe) {
                        tileDiv.classList.add("tile-safe");
                        tileDiv.innerHTML = "<span>★</span>"; // Add a star or other visual indicator
                    }
                    if (tileData.isArrow) {
                        tileDiv.classList.add("tile-arrow");
                        tileDiv.innerHTML = "<span>➔</span>"; // Add arrow indicator
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
                        // tileDiv.style.backgroundColor = CONFIG.PLAYER_COLORS[tileData.playerColor].hex; // Color home stretch, might be too strong
                        tileDiv.style.border = `1px dashed ${CONFIG.PLAYER_COLORS[tileData.playerColor].hex}`;
                        tileDiv.style.opacity = 0.7;
                    }
                    if (tileData.isCenterGoal) {
                        tileDiv.classList.add("tile-center-goal");
                    }
                    if (tileData.pathIndex !== undefined) {
                        tileDiv.dataset.pathIndex = tileData.pathIndex;
                        // tileDiv.textContent = tileData.pathIndex; // For debugging
                    }
                }
                this.boardElement.appendChild(tileDiv);
                this.tileElements.push(tileDiv);
            }
        }
    },

    _getBoardLayout: function(dim = 15) {
        const layout = Array(dim).fill(null).map(() => Array(dim).fill(null).map(() => ({ type: "empty", color: "transparent" })));

        const setRegion = (r, c, h, w, type, playerColor = null, baseColor = "#ddd") => {
            for (let i = r; i < r + h; i++) {
                for (let j = c; j < c + w; j++) {
                    if (i < dim && j < dim) {
                        layout[i][j] = { type: type, color: baseColor, playerColor: playerColor };
                    }
                }
            }
        };

        // Home Bases (6x6 areas)
        setRegion(0, 0, 6, 6, "home-base-area", "red", CONFIG.PLAYER_COLORS.red.light);
        setRegion(0, 9, 6, 6, "home-base-area", "green", CONFIG.PLAYER_COLORS.green.light); // Swapped Green and Blue for typical Ludo layout
        setRegion(9, 0, 6, 6, "blue", CONFIG.PLAYER_COLORS.blue.light); // Swapped Green and Blue
        setRegion(9, 9, 6, 6, "yellow", CONFIG.PLAYER_COLORS.yellow.light);

        // Actual Yards (e.g., 2x2 within the 6x6 home base area)
        // These are logical, TokenRenderer will place tokens within these general areas.
        // Example: Mark a central point for each yard for clarity or for TokenRenderer to use as a reference.
        const yardCenters = {
            red: { r: 2, c: 2 },       // Center of Red's 6x6 area
            green: { r: 2, c: 11 },   // Center of Green's 6x6 area
            yellow: { r: 11, c: 11 }, // Center of Yellow's 6x6 area
            blue: { r: 11, c: 2 }    // Center of Blue's 6x6 area
        };
        for (const color in yardCenters) {
            const {r, c} = yardCenters[color];
            // Mark a 2x2 yard area for example
            for(let yr=r-1; yr<=r; yr++) {
                for(let yc=c-1; yc<=c; yc++) {
                    if(layout[yr] && layout[yr][yc]) {
                        layout[yr][yc].isHomeBase = true;
                        layout[yr][yc].playerColor = color;
                    }
                }
            }
        }

        // Center Goal Area (3x3)
        setRegion(6, 6, 3, 3, "center-goal-area", null, "#cccccc");
        layout[7][7].isCenterGoal = true; // The very center tile

        // Main Path (52 tiles)
        const pathCoords = CONFIG.PATH_COORDINATES; // Get from CONFIG
        pathCoords.forEach((coord, index) => {
            if (layout[coord.r] && layout[coord.r][coord.c]) {
                layout[coord.r][coord.c] = {
                    type: "path",
                    color: "#ffffff", // White path tiles
                    pathIndex: index,
                    isSafe: CONFIG.SAFE_ZONE_INDICES.includes(index),
                    // isArrow: CONFIG.ARROW_TILES.some(at => at.index === index) // If using arrows
                };
                // Mark player start tiles with their color
                Object.keys(CONFIG.START_TILE_INDICES).forEach(playerColor => {
                    if (CONFIG.START_TILE_INDICES[playerColor] === index) {
                        layout[coord.r][coord.c].color = CONFIG.PLAYER_COLORS[playerColor].light; // Use light color for start tile
                        layout[coord.r][coord.c].isStart = true;
                        layout[coord.r][coord.c].playerColor = playerColor;
                    }
                });
            }
        });

        // Home Stretches (6 tiles per player)
        const homeStretches = CONFIG.HOME_STRETCH_COORDINATES; // Get from CONFIG
        Object.keys(homeStretches).forEach(playerColor => {
            homeStretches[playerColor].forEach((coord, index) => {
                if (layout[coord.r] && layout[coord.r][coord.c]) {
                    layout[coord.r][coord.c] = {
                        type: "home-stretch",
                        playerColor: playerColor,
                        color: CONFIG.PLAYER_COLORS[playerColor].hex, // Solid color for home stretch
                        isHomeStretch: true,
                        homeStretchIndex: index
                    };
                }
            });
        });

        return layout;
    },

    getTileElementByPathIndex: function(pathIndex) {
        return this.boardElement.querySelector(`.tile[data-path-index="${pathIndex}"]`);
    },

    getTileElementByCoords: function(row, col) {
        return this.boardElement.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
    },

    // Example: Highlight movable tokens or paths
    highlightTile: function(tileElement, highlight = true) {
        if (tileElement) {
            if (highlight) {
                tileElement.classList.add("highlighted");
            } else {
                tileElement.classList.remove("highlighted");
            }
        }
    }
};

// If not using ES6 modules, you might attach it to window or a global game object:
// window.GameNamespace = window.GameNamespace || {};
// window.GameNamespace.BoardRenderer = BoardRenderer;

