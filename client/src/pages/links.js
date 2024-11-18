import React from 'react';
import styles from './../css/learn.module.css'
import arrow from './../img/icons/double_arrow.svg';

const Openings = () => {
    return (
        <div className={styles["learn-container"]}>
            <div className={styles["learn-top"]}>
                <h1 className={styles["learn-header"]}>Master Chess Openings</h1><hr/>
                <p className={styles["learn-description"]}>Learn how to start your games with the best opening strategies to gain a strong position early on.</p>
            </div>
            <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/8IlJ3v8I4Z8"
                title="Openings Course"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            <div className={styles["video-navigation"]}>
                <h2 className={styles["video-title"]}>Opening Articles</h2>
                <ul className={styles["video-links"]}>
                    <li><a href="https://www.chess.com/article/view/the-history-of-the-kings-gambit" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>The King's Gambit: A History
                    </a></li>
                    <li><a href="https://thechessworld.com/articles/openings/sicilian-defense-playing-against-it-complete-guide" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>Sicilian Defense: Playing Against it - Complete Guide
                    </a></li>
                    <li><a href="https://www.365chess.com/view/italian-game/" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>Ultimate Guide to Winning with the Italian Game
                    </a></li>
                </ul>
            </div>
        </div>
    );
};

const MiddleGame = () => {
    return (
        <div className={styles["learn-container"]}>
            <div className={styles["learn-top"]}>
                <h1 className={styles["learn-header"]}>Middle Game Tactics</h1><hr/>
                <p className={styles["learn-description"]}>Learn key tactics, combinations, and strategies that will help you dominate the middle phase of the game.</p>
            </div>
            <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/rJCs0Gqtc0A"
                title="Middle Game Course"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            <div className={styles["video-navigation"]}>
                <h2 className={styles["video-title"]}>Middle Game Articles</h2>
                <ul className={styles["video-links"]}>
                    <li><a href="https://chessfox.com/5-ways-to-increase-your-control-over-the-centre/" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>Ways to Increase Your Control Over the Centre
                    </a></li>
                    <li><a href="https://thechessworld.com/articles/middle-game/7-most-important-middlegame-principles/" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>Most Important Middle Game Principles
                    </a></li>
                    <li><a href="https://thechessworld.com/articles/middle-game/defective-pawns-structures-middlegame/" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>Defective Pawns Structures in the Middle Game
                    </a></li>
                </ul>
            </div>
        </div>
    );
};

const Endgame = () => {
    return (
        <div className={styles["learn-container"]}>
            <div className={styles["learn-top"]}>
                <h1 className={styles["learn-header"]}>Endgame Mastery</h1><hr/>
                <p className={styles["learn-description"]}>Explore key endgame strategies, tactics, and lessons to help you win games in the final phase.</p>
            </div>
            <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/mCsc24k-Q8M"
                title="Endgame Course"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            <div className={styles["video-navigation"]}>
                <h2 className={styles["video-title"]}>Endgame Articles</h2>
                <ul className={styles["video-links"]}>
                    <li><a href="https://www.ragchess.com/how-to-win-king-and-pawn-vs-king-endgames/" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>How to Win a King and Pawn vs King Endgame
                    </a></li>
                    <li><a href="https://www.chess.com/terms/chess-checkmate-king-queen" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>Checkmate with King and Queen
                    </a></li>
                    <li><a href="https://www.chess.com/terms/two-knights-checkmate-chess" target='_blank' rel="noopener noreferrer" className={styles["video-link"]}>
                        <img src={arrow} alt="arrow"/>How to Win with Two Knights
                    </a></li>
                </ul>
            </div>
        </div>
    );
};

export {Openings, MiddleGame, Endgame}