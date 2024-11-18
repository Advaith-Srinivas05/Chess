import React from 'react';
import { Link } from 'react-router-dom';
import styles from './../css/learn.module.css';
import arrow from './../img/icons/double_arrow.svg';

const Learn = () => {
    return (
        <div className={styles["learn-container"]}>
            <div className={styles["learn-top"]}>
                <h1 className={styles["learn-header"]}>Learn Chess</h1><hr/>
                <p className={styles["learn-description"]}>
                    Explore tutorials, strategies, and techniques to master the game of chess.
                </p>
            </div>
            <div className={styles["video-navigation"]}>
                <h2 className={styles["video-title"]}>Chess Lessons</h2>
                <div>
                    <ul className={styles["video-links"]}>
                        <li>
                            <Link to="/openings" className={styles["video-link"]}>
                                <img src={arrow} alt="arrow" />
                                Complete Openings
                            </Link><br/>
                        </li>
                        <li>
                            <Link to="/middlegame" className={styles["video-link"]}>
                                <img src={arrow} alt="arrow" />
                                Complete Middle Game
                            </Link><br/>
                        </li>
                        <li>
                            <Link to="/endgame" className={styles["video-link"]}>
                                <img src={arrow} alt="arrow" />
                                Complete Endgame
                            </Link><br/>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles["article-container"]}>
                <h2 className={styles["section-title"]}>Latest Chess Articles</h2>
                <div className={styles["article-item"]}>
                    <a href="https://www.chess.com/article/view/how-to-understand-openings" target='_blank' className={styles["article-link"]}>
                        Understanding Chess Openings
                    </a>
                    <p>Learn the fundamentals of chess openings with this beginner guide.</p>
                </div>
                <div className={styles["article-item"]}>
                    <a href="https://www.chess.com/article/view/the-two-rook-endings-you-must-know" target='_blank' className={styles["article-link"]}>
                        The Two Rook Endings You Must Know
                    </a>
                    <p>Advanced strategies to close out a rook endgame with confidence.</p>
                </div>
                <div className={styles["article-item"]}>
                    <a href="https://www.chess.com/article/view/chess-psychology" target='_blank' className={styles["article-link"]}>
                        The Psychology of Chess
                    </a>
                    <p>How mental tactics can influence your chess decisions.</p>
                </div>
            </div>
            <div className={styles["video-container"]}>
                <div className={styles["video-item"]}>
                    <h2 className={styles["video-title"]}>Complete Openings</h2>
                    <iframe
                        src="https://www.youtube.com/embed/8IlJ3v8I4Z8"
                        title="Complete Openings"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className={styles["video-item"]}>
                    <h2 className={styles["video-title"]}>Complete Middle Game</h2>
                    <iframe
                        src="https://www.youtube.com/embed/rJCs0Gqtc0A"
                        title="Complete Middle Game"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className={styles["video-item"]}>
                    <h2 className={styles["video-title"]}>Complete Endgame</h2>
                    <iframe
                        src="https://www.youtube.com/embed/mCsc24k-Q8M"
                        title="Complete Endgame"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>

            <div className={styles["popular-games"]}>
                <h3 className={styles["section-title"]}>Popular Games</h3>
                <div className={styles["game-item"]}>
                    <span>Game 1: Magnus Carlsen vs Alireza Firouzja</span>
                    <a href="https://www.youtube.com/watch?v=1WEyUZ1SpHY" target='_blank' className={styles["game-link"]}>Watch Game</a>
                </div>
                <div className={styles["game-item"]}>
                    <span>Game 2: Hikaru Nakamura vs Vidit Gujrathi</span>
                    <a href="https://www.youtube.com/watch?v=Mg9000GMj74" target='_blank' className={styles["game-link"]}>Watch Game</a>
                </div>
                <div className={styles["game-item"]}>
                    <span>Game 3: Boris Spassky vs Bobby Fischer</span>
                    <a href="https://www.youtube.com/watch?v=i_M72rMdb3U" target='_blank' className={styles["game-link"]}>Watch Game</a>
                </div>
            </div>

            <a href="https://www.chessable.com/" target='_blank' className={styles["btn"]}>Explore More Courses</a>
        </div>
    );
};

export default Learn;
