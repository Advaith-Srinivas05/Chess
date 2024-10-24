import React from "react"
import { Link } from 'react-router-dom';
import './../css/play.css'

function Card(props){
    return(
        <Link className="card" to={props.href}>
            <img src={props.src} alt=""></img>
            <div className="container">
                <h4><b>{props.title}</b></h4>
                <p>{props.children}</p>
            </div>
        </Link>
    )
}

function Play(){
    return(
        <div id="card">
            <Card title="Play Online" src={require("./../img/play_images/chess-online.png")}>Increase your rating by competing Online!</Card>
            <Card title="Play vs Bots" href="/bots" src={require("./../img/play_images/bot_play.png")}>Go head to head vs the computer</Card>
            <Card title="Play with Friends" src={require("./../img/play_images/chess_friends.png")}>Challenge your friends to a 1v1 showdown!</Card>
        </div>
    )
}

export default Play