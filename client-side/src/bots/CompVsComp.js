import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import Engine from "./engine";

export default function ComputerVsComputer() {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const moveDelay = 1000; // 1 second delay between moves, can be changed
  const delayBeforeNewGame = 3000; // 3 seconds delay before restarting, can be changed

  // Function to get a random Stockfish level between 2 and 10
  function getRandomStockfishLevel() {
    return Math.floor(Math.random() * (10 - 2 + 1)) + 2; // Random number between 2 and 10
  }

  // Function to find the best move using Stockfish with a randomized level
  const findBestMove = useCallback(() => {
    const randomLevel = getRandomStockfishLevel(); // Randomize the Stockfish level
    engine.evaluatePosition(game.fen(), randomLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        // Make the best move found by Stockfish
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5) || "q", // Promote to queen if necessary
        });
        setGamePosition(game.fen());
      }
    });
  }, [game, engine]); // Add game and engine as dependencies

  // Trigger the computers to play each other with a delay between moves
  useEffect(() => {
    if (!game.game_over() && !game.in_draw()) {
      const timeout = setTimeout(() => {
        findBestMove(); // Make the best move after the delay
      }, moveDelay); // Delay between moves

      return () => clearTimeout(timeout); // Clean up the timeout on unmount
    } else {
      // After the game is over, reset the game after a delay
      const timeout = setTimeout(() => {
        game.reset();
        setGamePosition(game.fen());
      }, delayBeforeNewGame);

      return () => clearTimeout(timeout); // Clean up the timeout on unmount
    }
  }, [gamePosition, findBestMove, game]); // Add findBestMove and game as dependencies

  const customPieces = useMemo(() => {
    const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
    const pieceComponents = {};
    pieces.forEach(piece => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/img/chesspieces/${piece}.png)`,
            backgroundSize: "100%"
          }}
        />
      );
    });
    return pieceComponents;
  }, []);

  return (
    <Chessboard
      id="ComputerVsComputer"
      position={gamePosition}
      boardWidth={550}
      customBoardStyle={{
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
      }}
      customDarkSquareStyle={{ backgroundColor: "#779952" }}
      customLightSquareStyle={{ backgroundColor: "#edeed1" }}
      customPieces={customPieces}
      isDraggablePiece={() => false}
    />
  );
}
