import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import Chess from "chess.js"; // Import chess.js for managing chess logic
import Engine from "./../bots/engine2.js"; // Import your engine file
import styles from './../css/analysis.module.css'; // Import the CSS file

const Analysis = () => {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const inputRef = useRef(null);
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [positionEvaluation, setPositionEvaluation] = useState(0);
  const [depth, setDepth] = useState(10);
  const [bestLine, setBestLine] = useState("");
  const [possibleMate, setPossibleMate] = useState("");
  const [arrows, setArrows] = useState([]);

  // New function to apply FEN input to the board
  const applyFenToBoard = () => {
    const fen = inputRef.current.value;
    const { valid } = game.validate_fen(fen);
    if (valid) {
      game.load(fen);
      setChessBoardPosition(game.fen());
    } else {
      alert("Invalid FEN format. Please enter a valid FEN string.");
    }
  };

  function findBestMove() {
    engine.evaluatePosition(chessBoardPosition, depth);
    engine.onMessage(({ bestMove, evaluation, mateIn }) => {
      let adjustedEvaluation = evaluation;
      if (game.turn() === 'b') {
        adjustedEvaluation = -evaluation;
      }
      if (mateIn) {
        setPossibleMate(mateIn);
      }
      if (bestMove) {
        setBestLine(bestMove);
        setArrows([{
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
        }]);
      }
      if (evaluation !== null) {
        setPositionEvaluation(adjustedEvaluation);
      }
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1]?.toLowerCase() || "q",
    });

    if (move === null) return false;

    setPossibleMate("");
    setChessBoardPosition(game.fen());
    engine.stop();
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

  const squareToCoordinates = (square) => {
    const files = "abcdefgh";
    const ranks = "12345678";
    const size = 550 / 8;
    const x = files.indexOf(square[0]) * size + size / 2;
    const y = (7 - ranks.indexOf(square[1])) * size + size / 2;
    return [x, y];
  };

  const evalPercentage = useMemo(() => {
    const evalRange = 8;
    const boundedEval = Math.max(Math.min(positionEvaluation, evalRange), -evalRange);
    return ((boundedEval + evalRange) / (2 * evalRange)) * 100;
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
            boardWidth={550}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customPieces={customPieces}
            customDarkSquareStyle={{ backgroundColor: "#779952" }}
            customLightSquareStyle={{ backgroundColor: "#edeed1" }}
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
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="green"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="4"
                    markerHeight="2.8"
                    refX="0"
                    refY="1.4"
                    orient="auto"
                  >
                    <polygon points="0 0, 4 1.4, 0 2.8" fill="green" />
                  </marker>
                </defs>
              </svg>
            );
          })}
        </div>
      </div>
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
          placeholder="Paste FEN to start analysing custom position"
        />
        <div className={styles["button-container"]}>
          <button className={styles["button"]} onClick={applyFenToBoard}>Go</button>
          <button
            className={styles["button"]}
            onClick={() => {
              setPossibleMate("");
              setBestLine("");
              game.reset();
              setChessBoardPosition(game.fen());
            }}
          >
            Reset
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
            Undo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
