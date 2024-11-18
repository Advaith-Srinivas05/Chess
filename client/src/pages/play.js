import React from "react"
import { Link } from 'react-router-dom';
import styles from './../css/play.module.css'
import arrow from './../img/icons/double_arrow.svg'

function Play(){
    return(
        <div className={styles["rules-container"]}>
            <h1>Ranked Rules:</h1><hr/>
            <ul>
                <li>The player competes against a computer with the same Elo rating as themselves.</li>
                <li>Players can forfeit the game at any time.</li>
                <li>Sides (black or white) are assigned randomly before the game begins.</li>
                <li>The player's Elo rating is adjusted after each game based on the result, using the following calculation:</li>
                <ul>
                    <li>If the player wins, they will gain 15 Elo points.</li>
                    <li>If the game is a draw, there is no Elo gain/lost.</li>
                    <li>If the player loses, they will lose 15 Elo points.</li>
                </ul>
            </ul>
            <Link to="/ranked" className={styles["link"]}>Accept and Continue<img src={arrow}/></Link>
        </div>
    )
}

export default Play