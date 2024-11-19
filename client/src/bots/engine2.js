class Engine {
    constructor() {
      this.stockfish = new Worker("./../stockfish.js");
  
      // Listener to handle Stockfish responses
      this.onMessage = (callback) => {
        this.stockfish.addEventListener("message", (e) => {
          // Capture the best move from the engine response
          const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
  
          // Capture evaluation score (centipawn or mate)
          const evalMatch = e.data?.match(/score (cp|mate) (-?\d+)/);
          let evaluation = null;
          let mateIn = null;
  
          if (evalMatch) {
            if (evalMatch[1] === "cp") {
              evaluation = parseInt(evalMatch[2], 10) / 100; // Convert centipawns to pawns
            } else if (evalMatch[1] === "mate") {
              mateIn = parseInt(evalMatch[2], 10); // Mate in x moves
            }
          }
  
          // Call the provided callback with both bestMove and evaluation data
          callback({ bestMove, evaluation, mateIn });
        });
      };
  
      // Initialize the engine
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  
    // Method to send messages to Stockfish
    sendMessage(message) {
      this.stockfish.postMessage(message);
    }
  
    // Evaluate the current position at a specific depth
    evaluatePosition(fen, depth) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
    stop() {
      this.sendMessage("stop");
    }
    quit() {
      this.sendMessage("quit");
    }
  }
  
  export default Engine;
  