import React from 'react';
import { Link } from 'react-router-dom';
import './css/sidebar.css';

function SidebarElement(props){
  return(
      <Link to={props.href}>
        <div className={props.ele}>
            <img className={props.type} src={props.src} alt="img for sidebar"/>{props.children}
        </div>
      </Link>
  )
}

function Sidebar(){
  return(
    <div id="sidebar">
      <SidebarElement ele="sidebar-head" type="logo" src={require("./img/icons/logo.png")} href="/"/>
      <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/play_icon.png")} href="/play">&nbsp;Play</SidebarElement>
      <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/practice_icon.png")} href="/practice">&nbsp;Practice</SidebarElement>
      <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/leaderboard_icon.png")} href="/leaderboard">&nbsp;Leaderboard</SidebarElement>
      <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/learn_icon.png")} href="/learn">&nbsp;Learn</SidebarElement>
      <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/friends_icon.png")} href="/social">&nbsp;Social</SidebarElement>
    </div>
  )
};

export default Sidebar
