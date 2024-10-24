import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import Chess from 'chess.js';
import './../css/practice.css';

function Practice() {
  const [game, setGame] = useState(new Chess());

  // Safely modify the game state
  function safeGameMutate(modify) {
    setGame((g) => {
      const updatedGame = { ...g };
      modify(updatedGame);
      return updatedGame;
    });
  }

  // Function to handle piece drop (drag and drop pieces)
  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare, // auto-promote to queen
      });
    });

    // If the move is illegal, return false
    if (move === null) return false;
    return true;
  }

  // Function to clear the board
  function clearBoard() {
    safeGameMutate((game) => {
      game.clear();
    });
  }

  // Function to reset the board to the starting position
  function setStartPosition() {
    safeGameMutate((game) => {
      game.reset();
    });
  }

  return (
    <div id="practice-board-container">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        arePiecesDraggable={true}
        sparePieces={true} // Allow extra pieces off the board
        dropOffBoard={'trash'} // Enable trashing off-board pieces
        boardWidth={500}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.5)',
        }}
      />
      <div id="Btn-container">
        <button id="startBtn" className="Btn" onClick={setStartPosition}>
          <b>Start Position</b>
        </button>
        <button id="clearBtn" className="Btn" onClick={clearBoard}>
          <b>Clear Board</b>
        </button>
      </div>
    </div>
  );
}

export default Practice;
