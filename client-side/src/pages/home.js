import React from 'react';
import ComputerVsComputer from '../bots/CompVsComp.js';
import './../css/home.css';

function About() {
  return(
      <div id="about">
        <div id="upper"><h4>About Us</h4></div>
        <div>This is a Chess.com clone for our Sem-3 WebTech Project.<br/><br/>This is made by:<br/>
          <ul>
            <li>Advaith Srinivas</li>
            <li>Abhinav S Kokrady</li>
            <li>Amitesh Jammula</li>
          </ul>
        </div>
      </div>
  ) 
}

function Home(){
  return (
    <div id="main">
        <div>
          <ComputerVsComputer/>
        </div>
        <About/>
    </div>
  );
}

export default Home