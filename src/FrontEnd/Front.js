import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Createfile from "./createnew";
import "./404.css";
import "./front.css";

function Front() {
  return (
    <>
      <div class="stars">
        <Header />
        <div class="central-body">
          <div class="objects">
            <div class="earth-moon">
              <img
                class="object_rocket"
                src="https://i.ibb.co/cNWR1CK/rocket.png"
                width="40px"
              ></img>
              <img
                class="object_earth"
                src="https://i.ibb.co/TT145PQ/globe.png"
                width="100px"
              ></img>
              <img
                class="object_moon"
                src="https://i.ibb.co/74GwY71/moon-phase.png"
                width="50px"
              ></img>
            </div>
          </div>
          <div class="glowing_stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Front;
