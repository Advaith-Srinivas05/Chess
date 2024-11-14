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
  