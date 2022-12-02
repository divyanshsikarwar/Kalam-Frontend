import React, {
  useReducer,
  useState,
  useRef,
  useEffect,
  Component,
  componentDidMount,
  createRef,
} from "react";

import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import logo from "./file.png";
import save from "./FrontEnd/floppy-disk.png";
import down from "./FrontEnd/save.png";
import "./FrontEnd/text.css";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

/*
import draftToHtml from 'draftjs-to-html';
import {convertFromHTML} from 'html-to-draftjs';
import { EditorState,ContentState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
*/

// cennection to socket
const socket = io.connect("https://kalam-backend.onrender.com/");
var checker = 0;
var id = "";
var userstate = false;
// getting and sending doc id from react router
function Senddocid() {
  id = useParams().id;
  console.log(id);
}

var viewpasss = "";
var currContent = "";
function copy() {
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute("id", "dummy_id");
  document.getElementById("dummy_id").value = id;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function viewcopy() {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.setAttribute("id", "dummy_id");
  document.getElementById("dummy_id").value =
    "Hey! You can view my document by going to *https://kalam-editor.netlify.app/* \nAnd entering the following credentials : \nDocument ID: " +
    id +
    "\n" +
    "Password: " +
    viewpasss;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

// Main  component
function App() {
  if (id === "") {
    Senddocid();
  }
  const { quillRef, quill } = useQuill();

  const [content, updateContent] = useState("");
  const [access, updateaccess] = useState(true);
  const cont = useRef({});
  const [user, userUpdate] = useState("Admin");
  const users = useRef("Viewer");
  const [useronline, updateuseronline] = useState(0);

  /*----------------------------------*/

  function exportHTML() {
    if (quill) {
      var header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='https://www.w3.org/TR/html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
      var footer = "</body></html>";
      var sourceHTML = header + quill.root.innerHTML + footer;
      var source =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(sourceHTML);
      var fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = "document.doc";
      fileDownload.click();
      document.body.removeChild(fileDownload);
    }
  }

  /*--------------------------------------------*/

  socket.on("updateonline", (data) => {
    updateuseronline(data);
  });

  useEffect(() => {
    const getData = async () => {
      const resp = await axios.post(
        "https://kalam-backend.onrender.com/passcheck",
        {
          ID: id,
        }
      );

      if (resp.data.Exists === "false" || !sessionStorage.ID) {
        userstate = false;
        updateaccess(false);
        return;
      } else {
        viewpasss = await resp.data.V_P;
        try {
          var xx = sessionStorage.ID.split(";");

          if (xx[2] === "Admin") {
            if (resp.data.Password === xx[1] && id === xx[0]) {
              userstate = true;
              updateaccess(true);
              userUpdate("Admin");
              users.current = "Admin";
              document.getElementsByClassName("loader")[0].style.visibility =
                "hidden";
              document.getElementsByClassName("abs")[0].style.visibility =
                "hidden";
              document.getElementsByClassName("burr")[0].style.webkitFilter =
                "none";
              var bic = await axios.post(
                "https://kalam-backend.onrender.com/newfile",
                {
                  id: id,
                }
              );
              var basic = bic.data;
              updateuseronline(basic.others);

              if (basic.others === 1) {
                updateContent(basic.daa);
                currContent = basic.daa;
                if (quill) {
                  quill.updateContents(basic.daa);
                }
                socket.emit("dont-need-content", id);
              } else {
                socket.emit("need-content", id);
              }
            }
          } else if (xx[2] === "Viewer") {
            if (resp.data.Viewer_Password === xx[1] && id === xx[0]) {
              userstate = false;
              updateaccess(true);

              userUpdate("Viewer");
              users.current = "Viewer";
              document.getElementsByClassName("loader")[0].remove();
              document.getElementsByClassName("abs")[0].remove();
              document.getElementsByClassName("burr")[0].style.webkitFilter =
                "none";
              if (quill) {
                quill.enable(false);
              }
              var bic = await axios.post(
                "https://kalam-backend.onrender.com/newfile",
                {
                  id: id,
                }
              );
              var basic = bic.data;
              updateuseronline(basic.others);
              if (basic.others === 1) {
                updateContent(basic.daa);
                currContent = basic.daa;
                if (quill) {
                  quill.updateContents(basic.daa);
                }
                socket.emit("dont-need-content", id);
              } else {
                socket.emit("need-content", id);
              }
            }
          }
        } catch (err) {
          userstate = false;
          updateaccess(false);
        }
      }
    };
    getData();
  }, []);

  //someone else joins the room

  socket.on("want-content", () => {
    if (access === true && user === "Admin" && quill) {
      socket.emit("recieve-content", [id, quill.getContents()]);
    }
  });

  useEffect(() => {
    if (quill) {
      if (content !== "") {
        quill.updateContents(content);
      }

      setInterval(() => {
        if (userstate === true) {
          axios.post("https://kalam-backend.onrender.com/update", {
            DocID: id,
            content: quill.getContents(),
          });
        }
      }, 60000);

      quill.on("selection-change", function () {
        if (users.current === "Viewer") {
          quill.enable(false);
        }
      });

      quill.on("text-change", function (delta, oldDelta, source) {
        if (users.current === "Viewer") {
          quill.enable(false);
          return;
        }

        if (source === "user") {
          socket.emit("message", [delta, id]);
        }
      });

      socket.on("signal", (data) => {
        if (access === true) {
          checker = 1;
          // currContent = data;
          quill.updateContents(data);
        }
      });

      socket.on("take-content", (data) => {
        if (access === true && checker === 0) {
          checker = 1;
          quill.setContents(data);
        }
      });
    }
  }, [quill, users, content]);

  function cancel() {
    document.getElementByClass("ql-toolbar").style = "visibility:hidden";
  }
  // someone els e  in ro om edits content

  // what happen  s when content changes

  async function update() {
    if (quill) {
      await axios.post("https://kalam-backend.onrender.com/update", {
        DocID: id,
        content: quill.getContents(),
      });
    }
  }

  useEffect(() => {
    const handleTabClosing = () => {
      if (access == true) {
        axios.post("https://kalam-backend.onrender.com/exitfile", { id: id });
      }
    };

    window.addEventListener("beforeunload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", handleTabClosing);
    };
  }, [access]);

  // main return
  if (access === true) {
    if (users.current === "Admin") {
      socket.emit("docId", id);

      return (
        <>
          <div>
            <img
              id="savebtn"
              src={save}
              alt="Logo"
              onClick={update}
              height="24px"
              width="24px"
            />
            <img
              id="downbtn"
              src={down}
              alt="Logo"
              onClick={exportHTML}
              height="24px"
              width="24px"
            />

            <div id="Editor" ref={quillRef} />
            <span id="docid">
              Document ID : <span id="docidbg">{id}</span>
            </span>
            <img src={logo} alt="Logo" onClick={copy} />
            <div id="viewid">
              <span>
                Copy View Only Credentials :
                <img src={logo} alt="Logo" onClick={viewcopy} />
              </span>
            </div>
            <div id="online">
              <div>
                Users Online: {useronline} <div class="dot"></div>
              </div>
            </div>
          </div>
          <p id="notfp" class="abs">
            Checking Authentication
          </p>
          <span class="loader">
            <span class="loader-inner"></span>
          </span>
        </>
      );
    } else if (users.current === "Viewer") {
      socket.emit("docId", id);

      return (
        <>
          <div class="burr">
            <img
              Style="visibility:hidden"
              id="savebtn"
              src={save}
              alt="Logo"
              height="24px"
              width="24px"
            />
            <img
              id="downbtn"
              src={down}
              alt="Logo"
              onClick={exportHTML}
              height="24px"
              width="24px"
            />

            <div id="Editor" ref={quillRef} />
            <span id="docid">
              Document ID : <span id="docidbg">{id}</span>
            </span>
            <img src={logo} alt="Logo" onClick={copy} />
            <div id="viewid">
              <span Style="visibility:hidden">
                Copy View Only Credentials :
                <img src={logo} alt="Logo" />
              </span>
            </div>
            <div id="online">
              <div>
                Users Online: {useronline} <div class="dot"></div>
              </div>
            </div>
          </div>
          <p id="notfp" class="abs">
            Checking Authentication
          </p>
          <span class="loader">
            <span class="loader-inner"></span>
          </span>
        </>
      );
    }

    //asfdfklasjd
  } else {
    return (
      <>
        {cancel}
        <div class="stars">
          <h1 id="notfh1">403</h1>
          <p id="notfp">ACCESS DENIED.</p>
          <a id="notfbtn" href="/#/opendocument">
            Click Here to Open Existing Files.
          </a>
        </div>
        <div class="objects">
          <img
            class="object_rocket"
            src="http://salehriaz.com/404Page/img/rocket.svg"
            width="40px"
          ></img>
          <div class="earth-moon">
            <img
              class="object_earth"
              src="http://salehriaz.com/404Page/img/earth.svg"
              width="100px"
            ></img>
            <img
              class="object_moon"
              src="http://salehriaz.com/404Page/img/moon.svg"
              width="80px"
            ></img>
          </div>
          <div class="box_astronaut">
            <img
              class="object_astronaut"
              src="http://salehriaz.com/404Page/img/astronaut.svg"
              width="140px"
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
      </>
    );
  }
}

export default App;
