import React, { useMemo, useState } from 'react';
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMove() {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
    });

    // Illegal move
    if (move === null) return false;

    // Send the position to Stockfish (can integrate that later)
    if (game.in_checkmate()) {
      console.log("Checkmate!");
    }

    setTimeout(makeRandomMove, 200);
    return true;
  }

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
    <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={550} 
    customBoardStyle={{
      borderRadius: "4px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
    }} 
    customDarkSquareStyle={{
      backgroundColor: "#779952"
    }} 
    customLightSquareStyle={{
      backgroundColor: "#edeed1"
    }}
    customPieces={customPieces}/>
  );
}
