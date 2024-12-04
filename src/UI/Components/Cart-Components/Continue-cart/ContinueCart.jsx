import React from 'react'
import './ContinueCart.css';

const ContinueCart = () => {
    function openNav() {
        document.getElementById("myNav").style.width = "100%";
      }
      
      function closeNav() {
        document.getElementById("myNav").style.width = "0%";
      }
  return (
    <div className="overlay-content">
      <div id="myNav" className="overlay">
  <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
  <div>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Clients</a>
    <a href="#">Contact</a>
  </div>
</div>

<h2>Fullscreen Overlay Nav Example</h2>
<p>Click on the element below to open the fullscreen overlay navigation menu.</p>
<p>In this example, the navigation menu will slide in, from left to right:</p>
<span style={{fontSize:'30px', cursor: 'pointer'}} onClick={openNav}>&#9776; open</span>
    </div>
  )
}

export default ContinueCart