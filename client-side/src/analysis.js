import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import Chess from "chess.js"; // Import chess.js for managing chess logic
import Engine from "./bots/engine2.js"; // Import your engine file
import styles from './css/analysis.module.css'; // Import the CSS file

const Analysis = () => {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const inputRef = useRef(null);
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [positionEvaluation, setPositionEvaluation] = useState(0);
  const [depth, setDepth] = useState(10);
  const [bestLine, setBestLine] = useState("");
  const [possibleMate, setPossibleMate] = useState("");
  const [arrows, setArrows] = useState([]); // State for storing arrows

  function findBestMove() {
    // Evaluate the current position with the desired depth
    engine.evaluatePosition(chessBoardPosition, depth);

    engine.onMessage(({ bestMove, evaluation, mateIn }) => {
      // Invert the evaluation if it's Black's turn
      let adjustedEvaluation = evaluation;
      if (game.turn() === 'b') {
        adjustedEvaluation = -evaluation;
      }

      // If mate is possible, set mate info
      if (mateIn) {
        setPossibleMate(mateIn);
      }

      // Update the best move line and arrows
      if (bestMove) {
        setBestLine(bestMove);
        setArrows([{
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
        }]);
      }

      // Update position evaluation score
      if (evaluation !== null) {
        setPositionEvaluation(adjustedEvaluation); // Update evaluation with the adjustment
      }
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1]?.toLowerCase() || "q",
    });

    if (move === null) return false; // illegal move

    setPossibleMate("");
    setChessBoardPosition(game.fen());
    engine.stop(); // Stop the engine before continuing
    setBestLine("");
    setArrows([]);

    if (game.game_over() || game.in_draw()) return false;
    return true;
  }

  useEffect(() => {
    if (!game.game_over() && !game.in_draw()) {
      findBestMove();
    }
  }, [chessBoardPosition]);

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

  const handleFenInputChange = (e) => {
    const { valid } = game.validate_fen(e.target.value);
    if (valid && inputRef.current) {
      inputRef.current.value = e.target.value;
      game.load(e.target.value);
      setChessBoardPosition(game.fen());
    }
  };

  // Correct the arrow positioning
  const squareToCoordinates = (square) => {
    const files = "abcdefgh";
    const ranks = "12345678";
    const size = 550 / 8; // Each square is now 550px / 8 squares
    const x = files.indexOf(square[0]) * size + size / 2; // Adjust for center
    const y = (7 - ranks.indexOf(square[1])) * size + size / 2; // Adjust for center
    return [x, y];
  };

  // Calculate the percentage for the evaluation bar (between -1 and 1)
  const evalPercentage = useMemo(() => {
    const evalRange = 8; // Let's assume +/-8 is the max evaluation
    const boundedEval = Math.max(Math.min(positionEvaluation, evalRange), -evalRange);
    return ((boundedEval + evalRange) / (2 * evalRange)) * 100; // Maps eval to percentage (0% to 100%)
  }, [positionEvaluation]);

  return (
    <div className={styles["whole-wrapper"]}>
      <div className={styles["board-wrapper"]}>
        <div className={styles["evaluation-bar-container"]}>
          <div className={styles["evaluation-bar"]}>
            <div className={styles["black-bar"]} style={{ height: `${100 - evalPercentage}%` }}></div>
            <div className={styles["white-bar"]} style={{ height: `${evalPercentage}%` }}></div>
          </div>
        </div>
        <div className={styles["board-container"]}>
          <Chessboard
            id="AnalysisBoard"
            position={chessBoardPosition}
            onPieceDrop={(sourceSquare, targetSquare) =>
              onDrop(sourceSquare, targetSquare, "q")
            }
            boardWidth={550} // Set board width to 550px
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)", // Custom board style
            }}
            customPieces={customPieces}
            customDarkSquareStyle={{ backgroundColor: "#779952" }} // Dark square color
            customLightSquareStyle={{ backgroundColor: "#edeed1" }} // Light square color
          />
          {arrows.map((arrow, index) => {
            const [fromX, fromY] = squareToCoordinates(arrow.from);
            const [toX, toY] = squareToCoordinates(arrow.to);
            return (
              <svg
                key={index}
                className={styles["arrow-svg"]}
              >
                <line
                  x1={fromX} // Adjusted for center of the square
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="green"
                  strokeWidth="4" // Reduced stroke width
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="4"  // Reduced width
                    markerHeight="2.8" // Reduced height
                    refX="0"
                    refY="1.4"  // Adjusted for smaller arrowhead
                    orient="auto"
                  >
                    <polygon points="0 0, 4 1.4, 0 2.8" fill="green" /> // Adjusted points for smaller size
                  </marker>
                </defs>
              </svg>
            );
          })}
        </div>
      </div>
      {/* Vertical Evaluation Bar */}
      <div className={styles["menu"]}>
        <div className={styles["text"]}>
          <h3 style={{ textAlign: "center" }}>Analysis Menu:</h3>
          <h4 style={{ lineHeight: "40px" }}>
            Position Evaluation:{" "}
            {possibleMate ? `#${possibleMate}` : positionEvaluation}
            <br />
            Depth: {depth}
          </h4>
        </div>
        <input
          ref={inputRef}
          className={styles["input-fen"]}
          onChange={handleFenInputChange}
          placeholder="Paste FEN to start analysing custom position"
        />
        <div className={styles["button-container"]}>
          <button
            className={styles["button"]}
            onClick={() => {
              setPossibleMate("");
              setBestLine("");
              game.reset();
              setChessBoardPosition(game.fen());
            }}
          >
            reset
          </button>
          <button
            className={styles["button"]}
            onClick={() => {
              setPossibleMate("");
              setBestLine("");
              game.undo();
              setChessBoardPosition(game.fen());
            }}
          >
            undo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
