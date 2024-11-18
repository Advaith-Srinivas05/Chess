import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import Chess from 'chess.js';
import Engine from './engine3';
import './../css/PlayComputer.css';

const RankedGame = () => {
    const engine = useMemo(() => new Engine(), []);
    const game = useMemo(() => new Chess(), []);
    const [gamePosition, setGamePosition] = useState(game.fen());
    const [moves, setMoves] = useState([]);
    const [currentTimeout, setCurrentTimeout] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState('');
    const [playerColor, setPlayerColor] = useState('white');
    const [boardOrientation, setBoardOrientation] = useState('white');
    const [showSideSelectionModal, setShowSideSelectionModal] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const chessboardRef = useRef(null);
    const movesEndRef = useRef(null);

    const playerData = JSON.parse(localStorage.getItem('userData'));
    const playerElo = playerData?.rating?.elo;

    useEffect(() => {
        const initialSide = Math.random() < 0.5 ? 'white' : 'black';
        handleSideSelection(initialSide);
    }, []);

    const updateMoves = (history) => {
        setMoves([...history]);
    };

    const handleGameOver = (gameResult = null) => {
        setGameOver(true);
        setIsGameActive(false);
        let resultMessage;

        if (gameResult === 'forfeit') {
            resultMessage = "You forfeited the game!";
        } else if (game.in_checkmate()) {
            const winner = game.turn() === 'w' ? 'black' : 'white';
            const playerWon = winner === playerColor;
            gameResult = playerWon ? 'win' : 'loss';
            resultMessage = playerWon ? 'You won!' : 'You lost!';
            setResult(resultMessage);        
        } else {
            gameResult = 'draw';
            resultMessage = "It's a draw!";
        }

        setResult(resultMessage);
        updateRating(gameResult, resultMessage);
    };

    const updateRating = (gameResult, resultMessage) => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/api/update-rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                gameResult,
                playerRating: playerElo,
                moves,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Failed to update rating: ${response.statusText}`);
                return response.json();
            })
            .then((data) => {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (data?.newRating) {
                    userData.rating = data.newRating;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    setResult(
                        `${resultMessage} (Rating ${data.ratingChange >= 0 ? '+' : ''}${data.ratingChange})`
                    );
                } else {
                    throw new Error('Invalid response: Missing newRating');
                }
            })
            .catch((err) => {
                console.error('Error updating rating:', err);
                setResult('Error updating rating. Please try again later.');
            });
        engine.quit();
    };

    const onDrop = (sourceSquare, targetSquare, piece) => {
        if (!isPlayerTurn) return false;

        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece[1].toLowerCase() ?? 'q',
        });

        if (move === null) return false;

        setGamePosition(game.fen());
        setIsPlayerTurn(false);
        updateMoves(game.history());

        if (game.game_over()) {
            handleGameOver();
        } else {
            const newTimeout = setTimeout(findBestMove, 2000);
            setCurrentTimeout(newTimeout);
        }

        return true;
    };

    const findBestMove = () => {
        engine.evaluatePosition(game.fen(), playerElo);
        engine.onMessage(({ bestMove }) => {
            if (bestMove) {
                game.move({
                    from: bestMove.substring(0, 2),
                    to: bestMove.substring(2, 4),
                    promotion: bestMove.substring(4, 5) || 'q',
                });
                setGamePosition(game.fen());
                setIsPlayerTurn(true);
                updateMoves(game.history());

                if (game.game_over()) {
                    handleGameOver();
                }
            }
        });
    };

    const forfeit = () => {
        if (!isGameActive) return;
        handleGameOver('forfeit');
    };

    const handleSideSelection = (color) => {
        setIsGameActive(true);
        setPlayerColor(color);
        setBoardOrientation(color);
        game.reset();
        setGamePosition(game.fen());
        setIsPlayerTurn(color === 'white');
        chessboardRef.current?.clearPremoves();
        clearTimeout(currentTimeout);
        setMoves([]);
        setGameOver(false);
        setShowSideSelectionModal(false);

        if (color === 'black') {
            const newTimeout = setTimeout(findBestMove, 2000);
            setCurrentTimeout(newTimeout);
        }
    };

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
    
    const SideSelectionModal = ({ onSelectSide }) => (
        <div className="modal">
            <div className="modal-content">
                <h2>Choose Your Side</h2>
                <div className="button-container">
                    <button id="play-white" className="button-options" onClick={() => onSelectSide('white')}>
                        Play as White
                    </button>
                    <button id="play-black" className="button-options" onClick={() => onSelectSide('black')}>
                        Play as Black
                    </button>
                </div>
            </div>
        </div>
    );
    
    const GameOverModal = ({ result, onClose }) => (
        <div className="modal">
            <div className="modal-content">
                <h2>{result}</h2>
                <button id="close-button" className="button-options" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
    

    useEffect(() => {
        movesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [moves]);

    console.log('Player Data:', playerData);

    return (
        <div className="complete-wrapper">
            <div className='board-wrapper'>
                <Chessboard
                    id="RankedGame"
                    arePremovesAllowed={true}
                    position={gamePosition}
                    boardOrientation={boardOrientation}
                    isDraggablePiece={({ piece }) => piece[0] === playerColor[0]}
                    onPieceDrop={onDrop}
                    boardWidth={550}
                    customBoardStyle={{
                        borderRadius: "4px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
                    }}
                    customDarkSquareStyle={{ backgroundColor: "#779952" }}
                    customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                    customPieces={customPieces}
                    ref={chessboardRef}
                />
                <div className='name-container'>
                    <h3>{`Name: ${playerData.name}`}</h3>
                    <h3>{`Rating: ${playerData.rating}`}</h3>
                </div>
            </div>
            <div className='right-wrapper'>
                <div className="MoveDisplay">
                    <h2 id='move-heading'>Moves</h2>
                    <div className='outer-table'>
                        <table className="moves-table">
                            <tbody>
                                {moves.map((move, i) => (
                                    i % 2 === 0 ? (
                                        <tr key={i/2}>
                                            <td className="move-number">{i/2 + 1}.</td>
                                            <td className="white-move">{move}</td>
                                            <td className="black-move">{moves[i+1] || ''}</td>
                                        </tr>
                                    ) : null
                                ))}
                                <tr ref={movesEndRef}/>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='button-container'>
                    <button 
                        id='button-new' 
                        className="button" 
                        onClick={() => {
                            if (!isGameActive) {
                                handleSideSelection(Math.random() < 0.5 ? 'white' : 'black');
                            }
                        }}
                        disabled={isGameActive}
                        style={{
                            opacity: isGameActive ? 0.5 : 1,
                            cursor: isGameActive ? 'not-allowed' : 'pointer'
                        }}
                    >
                        New Game
                    </button>
                    <button 
                        id='button-forfeit' 
                        className="button" 
                        onClick={forfeit} 
                        disabled={!isGameActive}
                        style={{
                            opacity: !isGameActive ? 0.5 : 1,
                            cursor: !isGameActive ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Forfeit
                    </button>
                </div>
            </div>
            {showSideSelectionModal && (<SideSelectionModal onSelectSide={handleSideSelection}/>)}
            {gameOver && (<GameOverModal result={result} onClose={() => setGameOver(false)}/>)}
        </div>
    );
};

export default RankedGame;
