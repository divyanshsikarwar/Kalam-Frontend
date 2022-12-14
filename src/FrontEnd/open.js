import React from "react";
import ReactDOM from "react-dom";
import Image from "react-bootstrap/Image";
import axios from "axios";
import Header from "./Header";
import {
  Navbar,
  Nav,
  Form,
  Dropdown,
  Button,
  DropdownButton,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
var cookies = require("cookie");
var IDavailable = "";
var Password = "";
var DocID = "";
const crypto = require("crypto");
var hash = crypto.getHashes();

function updatedocid() {
  DocID = document.getElementById("updatedocid").value;
}

function updatepass() {
  Password = document.getElementById("updatepass").value;
}

function createnew() {
  var file = document.getElementById("openfile");
  file.style.display = "none";
  var file2 = document.getElementById("createfile");
  file2.style.display = "block";
}

/*--------------------------------------------------Final OPEN------------------------------------------------------------*/

var local_pass = "";
var localview_pass = "";

async function finalopen() {
  if (DocID === "" || Password === "") {
    document.getElementById("finalopenbtn").style.backgroundColor = "red";
    document.getElementById("empty").style.display = "block";
  } else {
    const response = await axios.post(
      "https://kalam-backend.onrender.com/check",
      { ID: DocID }
    );
    IDavailable = await response.data.ans;
    if (IDavailable === false) {
      const res = await axios.post(
        "https://kalam-backend.onrender.com/passcheck",
        { ID: DocID }
      );
      local_pass = await res.data.Password;
      localview_pass = await res.data.Viewer_Password;
    }
  }
  var Passwordhash = crypto.createHash("sha1").update(Password).digest("hex");

  if (IDavailable === true) {
    document.getElementById("open-prompt1").style.display = "block";
    document.getElementById("finalopenbtn").style.backgroundColor = "red";
  } else {
    if (Passwordhash !== local_pass && Passwordhash !== localview_pass) {
      document.getElementById("open-prompt1").style.display = "block";
      document.getElementById("finalopenbtn").style.backgroundColor = "red";
    } else if (Passwordhash === localview_pass) {
      document.getElementById("open-prompt1").style.display = "none";
      document.getElementById("finalopenbtn").style.backgroundColor =
        "rgb(34, 180, 34)";
      document.getElementById("empty").style.display = "none";
      sessionStorage.ID = DocID + ";" + Passwordhash + ";Viewer";
      window.open("/#/file/" + DocID, "_self");
    } else if (Passwordhash === local_pass) {
      document.getElementById("open-prompt1").style.display = "none";
      document.getElementById("finalopenbtn").style.backgroundColor =
        "rgb(34, 180, 34)";
      document.getElementById("empty").style.display = "none";
      sessionStorage.ID = DocID + ";" + Passwordhash + ";Admin";
      window.open("/#/file/" + DocID, "_self");
    }
  }
}

/*----------------------------------------HTML RETURN---------------------------------------*/

function Createfile() {
  return (
    <div id="openbg">
      <Header />
      <div id="particles-js"></div>
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
      <div id="openbgt"></div>
      <div>
        <Container fluid id="openfile">
          <Row>
            <Col>
              <h3 class="open-heading">Open Existing Document</h3>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label className="headings">
                    URL or Document ID
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="kalam-editor.netlify.app/file/111  *OR*  111"
                    onChange={updatedocid}
                    id="updatedocid"
                  />
                </Form.Group>
                <Form.Text className="text-muted" class="formtexxt" id="empty">
                  Document ID Cannot be Empty.
                </Form.Text>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label className="headings">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={updatepass}
                    id="updatepass"
                  />
                </Form.Group>
                <h6 id="open-prompt1" class="prompt">
                  Invalid Document ID/Password or Document do NOT Exists.
                </h6>

                <Button
                  variant="primary"
                  Style="width: 100%"
                  onClick={finalopen}
                  className="butt"
                  id="finalopenbtn"
                >
                  Open Document
                </Button>
                <Form.Text className="text-muted" class="formtexxt">
                  Try Double Click if single dosn't works.
                </Form.Text>
                <br />
                <h1 class="open-heading">--------</h1>
                <Button
                  href="/#/createnew"
                  variant="outline-primary"
                  id="orbtn"
                >
                  Create New Document
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Createfile;
