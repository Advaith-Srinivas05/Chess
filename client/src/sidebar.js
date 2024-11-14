import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logout from './img/icons/logout_icon.svg';
import styles from './css/sidebar.module.css';

function SidebarElement(props){
  	return(
      	<Link to={props.href}>
        	<div className={styles[props.ele]}>
            	<img className={styles[props.type]} src={props.src} alt="img for sidebar"/>{props.children}
        	</div>
      	</Link>
  	)
}

function Sidebar(){
  	const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        // Prevent going back when logged in
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function(event) {
        	window.history.pushState(null, null, window.location.href);
        };

        // Cleanup function
        return () => {
            window.onpopstate = null;
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token
        localStorage.removeItem('userData'); // Remove user data
        delete axios.defaults.headers.common['Authorization']; // Remove auth header
        navigate('/auth');
    };

    if (!userData) {
        return <div>Loading...</div>;
    }
  	return(
    	<div className={styles.sidebar}>
            <div className={styles['sidebar-top']}>
                <SidebarElement ele="sidebar-head" type="logo" src={require("./img/icons/logo.png")} href="/home"/>
                <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/play_icon.png")} href="/play">&nbsp;Play</SidebarElement>
                <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/practice_icon.png")} href="/practice">&nbsp;Practice</SidebarElement>
                <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/leaderboard_icon.png")} href="/leaderboard">&nbsp;Leaderboard</SidebarElement>
                <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/learn_icon.png")} href="/learn">&nbsp;Learn</SidebarElement>
                <SidebarElement ele="sidebar-element" type="icon" src={require("./img/icons/friends_icon.png")} href="/social">&nbsp;Social</SidebarElement>
            </div>
			<div className={styles['sidebar-bottom']}>
                <div onClick={handleLogout} className={styles['logout-button']}>
                    <img src={logout}/>&nbsp;Logout
                </div>
            </div>
		</div>
  	)
};

export default Sidebar
