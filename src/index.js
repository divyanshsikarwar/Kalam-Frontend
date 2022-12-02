import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Front from "./FrontEnd/Front";
import Home from "./FrontEnd/home";
import Notfound from "./FrontEnd/404";
import Didyoumean from "./FrontEnd/didyoumean";
import reportWebVitals from "./reportWebVitals";
import Newfile from "./FrontEnd/createnew";
import Openfile from "./FrontEnd/open";
import axios from "axios";
import { Route, BrowserRouter as Router, Redirect,HashRouter } from "react-router-dom";
var crypto = require("crypto");

/*
function imhere() {
  console.log("-----------")
  axios.post("http://localhost:3002/newfile",{"id":id})
}
function bye() {
  console.log("-----------------------------------")
  axios.post("http://localhost:3002/exitfile",{"id":id})
}
*/

function random() {
  var id = crypto.randomBytes(20).toString("hex");
  return id;
}
<Redirect to={`/#/file/${random()}`} />;

ReactDOM.render(
  <React.StrictMode>
  <HashRouter>

    <switch>
      <Route path="/" component={Home} exact />
      <Route path="/home" component={Home} exact />
      <Route path="/createnew" component={Newfile} exact />

      <Route path="/opendocument" component={Openfile} exact/>

      <Route path="/file/:id" component={App} exact />

      <Route path="/file:id" component={Notfound} exact/>

      <Route path="/404" component={Notfound} exact/>

      <Route path="/readmore" component={Notfound} exact/>

      <Route path="/[:id]" exact>
        <Notfound />
      </Route>

      <Route path="/file/[:id]" exact>
        <Notfound />
      </Route>

      <Route path="/file" exact>
        <Notfound />
      </Route>

      <Route path="/files">
        <Didyoumean />
      </Route>
    </switch>
  
  </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
