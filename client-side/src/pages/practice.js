import React from "react"
import {Link} from 'react-router-dom'
import './../css/practice.css'

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

function Practice(){
    return(
        <div id="card">
            <Card title="Analysis" href="/analysis" src={require("./../img/practice_images/brilliant.png")}>Go head to head vs the computer</Card>
            <Card title="Custom Board" href="/custom" src={require("./../img/practice_images/practice.webp")}>Challenge your friends to a 1v1 showdown!</Card>
        </div>
    )
}

export default Practice