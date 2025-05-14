// network_manager.js: Handles multiplayer communication (stub)

const NetworkManager = {
    isConnected: false,
    roomId: null,
    playerId: null, // Unique ID for this player in a session

    init: function() {
        console.log("NetworkManager initialized (stub).");
        // In a real implementation, this would establish a connection to a server
        // or set up peer-to-peer connections.
    },

    connect: function(serverUrl) {
        // Placeholder for connecting to a signaling server or game server
        console.log(`Attempting to connect to server: ${serverUrl} (stub)`);
        // Simulate connection success/failure
        setTimeout(() => {
            // this.isConnected = true;
            // this.playerId = "player_" + Date.now(); // Example player ID
            // console.log("Connected to server. Player ID:", this.playerId);
            // if (this.onConnect) this.onConnect();
            console.warn("NetworkManager.connect is a stub. No actual connection made.");
        }, 1000);
    },

    createRoom: function(roomName) {
        if (!this.isConnected && !CONFIG.ALLOW_OFFLINE_MULTIPLAYER_STUB) {
            // console.error("Cannot create room: Not connected to server.");
            // return Promise.reject("Not connected");
        }
        this.roomId = roomName || "room_" + Date.now();
        console.log(`Room created/joined: ${this.roomId} (stub)`);
        // Simulate room creation and return a promise
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.onRoomJoined) this.onRoomJoined({ roomId: this.roomId, host: true });
                resolve({ roomId: this.roomId, host: true });
            }, 500);
        });
    },

    joinRoom: function(roomIdToJoin) {
        if (!this.isConnected && !CONFIG.ALLOW_OFFLINE_MULTIPLAYER_STUB) {
            // console.error("Cannot join room: Not connected to server.");
            // return Promise.reject("Not connected");
        }
        this.roomId = roomIdToJoin;
        console.log(`Attempting to join room: ${roomIdToJoin} (stub)`);
        // Simulate room joining
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // const success = Math.random() > 0.2; // Simulate success/failure
                // if (success) {
                    if (this.onRoomJoined) this.onRoomJoined({ roomId: this.roomId, host: false });
                    resolve({ roomId: this.roomId, host: false });
                // } else {
                //     console.error(`Failed to join room ${this.roomId}`);
                //     if (this.onRoomJoinError) this.onRoomJoinError("Room full or not found");
                //     reject("Room full or not found");
                // }
            }, 1000);
        });
    },

    leaveRoom: function() {
        if (this.roomId) {
            console.log(`Leaving room: ${this.roomId} (stub)`);
            const oldRoomId = this.roomId;
            this.roomId = null;
            if (this.onRoomLeft) this.onRoomLeft({ roomId: oldRoomId });
        }
    },

    sendGameState: function(gameState) {
        if (!this.roomId) {
            // console.warn("Cannot send game state: Not in a room.");
            return;
        }
        console.log("Sending game state to room:", this.roomId, "(stub)", gameState);
        // In a real implementation, this would serialize and send the state to other players.
        // For a stub, we might simulate receiving it back for local testing if needed.
    },

    sendPlayerAction: function(action) {
        if (!this.roomId) {
            // console.warn("Cannot send player action: Not in a room.");
            return;
        }
        console.log("Sending player action to room:", this.roomId, "(stub)", action);
        // Example action: { type: "diceRoll", value: 6 } or { type: "moveToken", tokenId: "red-0", targetPosition: 10 }
        // This would be broadcast to other players in the room.
    },

    // --- Event Handlers (to be set by other modules, e.g., GameLogic or Main) ---
    onConnect: null, // Callback when connection is established
    onDisconnect: null, // Callback when disconnected
    onRoomJoined: null, // Callback when a room is successfully joined (data: { roomId, host })
    onRoomJoinError: null, // Callback on room join failure (error)
    onRoomLeft: null, // Callback when a room is left (data: { roomId })
    onPlayerJoined: null, // Callback when another player joins the room (data: { playerId, playerName })
    onPlayerLeft: null, // Callback when another player leaves the room (data: { playerId })
    onGameStateReceived: null, // Callback when a full game state is received (gameState)
    onPlayerActionReceived: null, // Callback when a player action is received (action)
    onChatMessageReceived: null, // Callback for chat messages

    // --- Chat (Stub) ---
    sendChatMessage: function(message) {
        if (!this.roomId) {
            // console.warn("Cannot send chat message: Not in a room.");
            return;
        }
        console.log(`Sending chat message to room ${this.roomId}: "${message}" (stub)`);
        // Simulate receiving it back or broadcasting
        if (this.onChatMessageReceived) {
            this.onChatMessageReceived({ senderId: this.playerId || "localPlayer", message: message });
        }
    }
};

// CONFIG.ALLOW_OFFLINE_MULTIPLAYER_STUB should be defined in config.js if used
// e.g., const ALLOW_OFFLINE_MULTIPLAYER_STUB = true; // For testing multiplayer UI without a server

// Initialization would typically happen in main.js
// NetworkManager.init();

