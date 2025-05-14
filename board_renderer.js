// board_renderer.js: Responsible for drawing the Ludo board

const BoardRenderer = {
    boardElement: null,
    tileElements: [], // To store references to tile DOM elements
    canvas: null, // For drawing the main board image if needed
    ctx: null,

    init: function(boardContainerId = "game-board-area", canvasId = "ludo-board-canvas") {
        this.boardElement = document.getElementById(boardContainerId);
        this.canvas = document.getElementById(canvasId);

        if (!this.boardElement) {
            console.error(`Board container with id "${boardContainerId}" not found.`);
            return;
        }
        if (!this.canvas) {
            console.error(`Canvas with id "${canvasId}" not found.`);
            // Proceeding without canvas for now, background will be on boardElement
        }

        this.boardElement.innerHTML = ""; // Clear previous board content (like old tiles if any)
        if (this.canvas) this.canvas.innerHTML = ""; // Clear canvas if it had fallbacks
        
        this.tileElements = [];

        const boardImg = AssetsManager.getImage("boardImage");
        if (boardImg && this.canvas) {
            this.ctx = this.canvas.getContext("2d");
            // Set canvas dimensions based on the loaded board image to maintain aspect ratio
            const aspectRatio = boardImg.width / boardImg.height;
            // Assuming the game area width is constrained by CSS, adjust height accordingly
            // Or, set a fixed size based on design. For example, 600x600.
            // Let's make canvas fill its container, and draw image scaled.
            const containerWidth = this.boardElement.clientWidth || 600;
            const containerHeight = this.boardElement.clientHeight || 600;

            this.canvas.width = containerWidth; // Use actual container width
            this.canvas.height = containerHeight; // Use actual container height
            
            // Draw the board image onto the canvas, fitting it appropriately
            // Option 1: Fit within canvas, maintaining aspect ratio (letterboxing if needed)
            let drawWidth = this.canvas.width;
            let drawHeight = this.canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (this.canvas.width / this.canvas.height > aspectRatio) {
                // Canvas is wider than image aspect ratio
                drawHeight = this.canvas.height;
                drawWidth = drawHeight * aspectRatio;
                offsetX = (this.canvas.width - drawWidth) / 2;
            } else {
                // Canvas is taller or same aspect ratio
                drawWidth = this.canvas.width;
                drawHeight = drawWidth / aspectRatio;
                offsetY = (this.canvas.height - drawHeight) / 2;
            }
            this.ctx.drawImage(boardImg, offsetX, offsetY, drawWidth, drawHeight);
            console.log("Board image drawn on canvas.");
            // The grid of divs will be overlaid on this canvas.
            // Ensure #game-board-area positions the canvas and the grid correctly (e.g. using CSS grid or absolute positioning for overlay)
        } else if (boardImg) {
            // Fallback if no canvas: set as background of boardElement
            this.boardElement.style.backgroundImage = `url(${boardImg.src})`;
            this.boardElement.style.backgroundSize = "contain"; 
            this.boardElement.style.backgroundRepeat = "no-repeat";
            this.boardElement.style.backgroundPosition = "center";
            console.log("Board image set as background for boardElement.");
        } else {
            console.error("Board background image not loaded.");
            if (this.canvas && this.ctx) {
                this.ctx.fillStyle = "#2c3e50";
                this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = "white"; this.ctx.fillText("Board image failed to load", 50,50);
            } else {
                this.boardElement.style.backgroundColor = "#333";
            }
        }

        this._createBoardGrid(); // Create the logical grid (transparent tiles)
        console.log("BoardRenderer initialized, background set/drawn, and logical board grid created.");
    },

    _createBoardGrid: function() {
        const dim = CONFIG.BOARD_DIMENSIONS;
        // Ensure boardElement is styled to be a grid container for the logical tiles
        this.boardElement.style.position = "relative"; // Important for overlaying grid on canvas if canvas is a child
        this.boardElement.style.display = "grid";
        this.boardElement.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${dim}, 1fr)`;
        // The boardElement should have its size defined by CSS or match the canvas/image size.

        const layout = this._getBoardLayout(dim);

        for (let r = 0; r < dim; r++) {
            for (let c = 0; c < dim; c++) {
                const tileData = layout[r][c];
                const tileDiv = document.createElement("div");
                tileDiv.classList.add("tile");
                tileDiv.dataset.row = r;
                tileDiv.dataset.col = c;
                tileDiv.dataset.type = tileData.type;

                tileDiv.style.backgroundColor = "transparent"; // Make tiles transparent
                // tileDiv.style.border = "1px solid rgba(255,0,0,0.1)"; // Debug border for grid visibility
                tileDiv.style.display = "flex"; // For centering content like tokens
                tileDiv.style.alignItems = "center";
                tileDiv.style.justifyContent = "center";
                tileDiv.style.position = "relative"; // For token positioning within tile

                if (tileData.type !== "empty") {
                    if (tileData.isSafe) {
                        tileDiv.classList.add("tile-safe");
                        // Visual cue for safe spot can be subtle if board image has it
                        // e.g., tileDiv.style.outline = "1px dashed yellow"; 
                    }
                    // Other specific tile type classes can be added if needed for logic or subtle styling
                }
                if (tileData.pathIndex !== undefined) {
                    tileDiv.dataset.pathIndex = tileData.pathIndex;
                }
                if (tileData.playerColor) {
                    tileDiv.dataset.playerColor = tileData.playerColor;
                }
                if (tileData.homeStretchIndex !== undefined) {
                    tileDiv.dataset.homeStretchIndex = tileData.homeStretchIndex;
                }

                this.boardElement.appendChild(tileDiv);
                this.tileElements.push(tileDiv);
            }
        }
    },

    // _getBoardLayout remains the same as it defines the logical structure
    _getBoardLayout: function(dim = 15) {
        const layout = Array(dim).fill(null).map(() => Array(dim).fill(null).map(() => ({ type: "empty", color: "transparent" })));

        const setRegion = (r, c, h, w, type, playerColor = null, baseColor = "#ddd") => {
            for (let i = r; i < r + h; i++) {
                for (let j = c; j < c + w; j++) {
                    if (i < dim && j < dim) {
                        // Base color is now mostly irrelevant as tiles are transparent
                        layout[i][j] = { type: type, playerColor: playerColor };
                    }
                }
            }
        };

        // Home Bases (6x6 areas) - these are logical areas, visuals from board image
        setRegion(0, 0, 6, 6, "home-base-area", "red");
        setRegion(0, 9, 6, 6, "home-base-area", "green");
        setRegion(9, 0, 6, 6, "home-base-area", "blue");
        setRegion(9, 9, 6, 6, "home-base-area", "yellow");

        const yardCenters = {
            red: { r: 2, c: 2 }, green: { r: 2, c: 11 }, yellow: { r: 11, c: 11 }, blue: { r: 11, c: 2 }
        };
        for (const color in yardCenters) {
            const {r, c} = yardCenters[color];
            for(let yr=r-1; yr<=r; yr++) {
                for(let yc=c-1; yc<=c; yc++) {
                    if(layout[yr] && layout[yr][yc]) {
                        layout[yr][yc].isHomeBase = true;
                        layout[yr][yc].playerColor = color;
                    }
                }
            }
        }
        
        setRegion(6, 6, 3, 3, "center-goal-area");
        layout[7][7].isCenterGoal = true;

        const pathCoords = CONFIG.PATH_COORDINATES;
        pathCoords.forEach((coord, index) => {
            if (layout[coord.r] && layout[coord.r][coord.c]) {
                layout[coord.r][coord.c] = {
                    type: "path",
                    pathIndex: index,
                    isSafe: CONFIG.SAFE_ZONE_INDICES.includes(index),
                };
                Object.keys(CONFIG.START_TILE_INDICES).forEach(playerColor => {
                    if (CONFIG.START_TILE_INDICES[playerColor] === index) {
                        layout[coord.r][coord.c].isStart = true;
                        layout[coord.r][coord.c].playerColor = playerColor;
                    }
                });
            }
        });

        const homeStretches = CONFIG.HOME_STRETCH_COORDINATES;
        Object.keys(homeStretches).forEach(playerColor => {
            homeStretches[playerColor].forEach((coord, stretchIdx) => {
                if (layout[coord.r] && layout[coord.r][coord.c]) {
                    layout[coord.r][coord.c] = {
                        type: "home-stretch",
                        playerColor: playerColor,
                        isHomeStretch: true,
                        homeStretchIndex: stretchIdx
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
    
    // Get a home base tile for a player color and token index (0-3)
    getHomeBaseTile: function(playerColor, tokenIndex) {
        // This needs a more robust way to find specific spots in the home base area.
        // For now, just find any tile in that player's home base area.
        // The TokenRenderer will need to position tokens within this area.
        const homeBaseTiles = Array.from(this.boardElement.querySelectorAll(`.tile[data-type='home-base-area'][data-player-color='${playerColor}']`));
        // A simple distribution for 4 tokens, e.g. using the 2x2 grid logic from _getBoardLayout
        // This part needs to align with how TokenRenderer places tokens in the yard.
        // The `isHomeBase` marked tiles could be used.
        const specificHomeTiles = Array.from(this.boardElement.querySelectorAll(`.tile[data-player-color='${playerColor}'][data-type='home-base-area'][data-ishomebase='true']`));
        return specificHomeTiles[tokenIndex % specificHomeTiles.length] || homeBaseTiles[0]; // Fallback
    },

    highlightTile: function(tileElement, highlight = true) {
        if (tileElement) {
            if (highlight) {
                tileElement.classList.add("highlighted"); // CSS will define this highlight (e.g. a border or overlay)
            } else {
                tileElement.classList.remove("highlighted");
            }
        }
    }
};

