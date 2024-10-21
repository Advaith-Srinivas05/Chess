import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import Chess from 'chess.js';
import Engine from './engine';
import './css/PlayComputer.css';

const PlayVsStockfish = () => {
  const levels = {
    "Easy 🤓": 2,
    "Medium 🧐": 8,
    "Hard 😵": 18
  };

  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [moves, setMoves] = useState([]);  // Track the moves
  const [stockfishLevel, setStockfishLevel] = useState(2);
  const [currentTimeout, setCurrentTimeout] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Track if it's player's turn
  const chessboardRef = useRef(null);
  const movesEndRef = useRef(null); // Reference to the bottom of the move list

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5) || "q"
        });
        setGamePosition(game.fen());
        setIsPlayerTurn(true); // After Stockfish's move, it's player's turn again
        updateMoves(game.history()); // Update move history
      }
    });
  }

  function updateMoves(history) {
    setMoves([...history]);  // Update moves array with game history
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    if (!isPlayerTurn) return false; // Block player move if it's not their turn

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q"
    });

    if (move === null) return false;

    setGamePosition(game.fen());
    setIsPlayerTurn(false); // Now it's Stockfish's turn
    updateMoves(game.history()); // Update move history

    if (!game.game_over() && !game.in_draw()) {
      const newTimeout = setTimeout(findBestMove, 2000); // Find best move after 2 seconds
      setCurrentTimeout(newTimeout);
    }

    return true;
  }

  function undoLastMove() {
    if (isPlayerTurn) {
      game.undo(); // Undo Stockfish's move
      game.undo(); // Undo player's move
    } else {
      game.undo(); // Undo player's move
    }

    setGamePosition(game.fen());
    setIsPlayerTurn(true); // After undoing, it's player's turn again
    chessboardRef.current?.clearPremoves(); // Clear premoves
    clearTimeout(currentTimeout); // Clear any timeouts
    updateMoves(game.history()); // Update move history
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

  // useEffect to scroll the moves display to the bottom when moves change
  useEffect(() => {
    movesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves]);

  return (
    <div className="complete-wrapper">
      <div className='board-wrapper'>
        <Chessboard
          id="PlayVsStockfish"
          arePremovesAllowed={true}
          position={gamePosition}
          isDraggablePiece={({ piece }) => piece[0] === "w"} // White pieces are draggable
          onPieceDrop={onDrop}
          boardWidth={550}
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
          customPieces={customPieces}
          ref={chessboardRef} // Chessboard ref for clearing premoves
        />

        <div className="button-container">
          {Object.entries(levels).map(([level, depth]) => (
            <button
              key={level}
              id={`button-${level.replace(/\s/g, '').toLowerCase()}`}
              className={`button ${depth === stockfishLevel ? 'button-active' : ''}`}
              onClick={() => setStockfishLevel(depth)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      <div className='right-wrapper'>
        <div className="MoveDisplay">
          <h2 id='move-heading'>Moves</h2>
          <div className='outer-table'>
            <table className="moves-table">
              <tbody>
                {moves.map((move, index) => (
                  index % 2 === 0 ? (
                    <tr key={index}>
                      <td className="move-number">{Math.floor(index / 2) + 1}.</td>
                      <td className="white-move">{move}</td>
                      <td className="black-move">{moves[index + 1] || ''}</td>
                    </tr>
                  ) : null
                ))}
                {/* Empty div used for scrolling to the bottom */}
                <tr>
                  <td colSpan="3">
                    <div ref={movesEndRef} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='button-container'>
          <button
            id='button-new'
            className="button"
            onClick={() => {
              game.reset();
              setGamePosition(game.fen());
              setIsPlayerTurn(true); // Reset to player's turn
              chessboardRef.current?.clearPremoves(); // Clear premoves
              clearTimeout(currentTimeout); // Clear any timeouts
              setMoves([]); // Clear the move history
            }}
          >
            New Game
          </button>

          <button
            id='button-undo'
            className="button"
            onClick={undoLastMove} // Call the updated undo function
          >
            Undo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayVsStockfish;
