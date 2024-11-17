class Engine {
    constructor() {
        this.stockfish = new Worker("./../stockfish.js");
        
        this.onMessage = (callback) => {
            this.stockfish.addEventListener("message", (e) => {
                const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
                callback({ bestMove });
            });
        };
        
        // Initialize the engine
        this.sendMessage("uci");
        this.sendMessage("isready");
    }

    sendMessage(message) {
        this.stockfish.postMessage(message);
    }

    // Convert ELO to Stockfish skill level (0-20)
    eloToSkillLevel(elo) {
        // Mapping ELO ranges to skill levels
        if (elo < 800) return 2;  // Beginner
        if (elo < 1000) return 5; // Novice
        if (elo < 1200) return 8; // Intermediate
        if (elo < 1400) return 12; // Advanced
        if (elo < 1600) return 15; // Expert
        if (elo < 1800) return 18; // Master
        return 20; // Grandmaster
    }

    evaluatePosition(fen, playerElo) {
        const skillLevel = this.eloToSkillLevel(playerElo);
        this.stockfish.postMessage(`setoption name Skill Level value ${skillLevel}`);
        this.stockfish.postMessage(`position fen ${fen}`);
        this.stockfish.postMessage(`go depth ${Math.min(skillLevel + 5, 18)}`);
    }

    stop() {
        this.sendMessage("stop");
    }

    quit() {
        this.sendMessage("quit");
    }
}

export default Engine;
