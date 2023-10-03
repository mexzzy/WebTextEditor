import React, { useState } from "react";
import logo from "../images/logo.png";
function Nav() {
  const [aboutDialog, setAboutDialog] = useState(false);

  const aboutDialogHandler = () => {
    setAboutDialog(!aboutDialog);
  };

  const aboutList = [
    {
      id: "1",
      text: " Customize text font style.",
    },
    {
      id: "2",
      text: " Customize text font size.",
    },
    {
      id: "3",
      text: " Customize text boldness.",
    },
    {
      id: "4",
      text: " Customize text italic.",
    },
    {
      id: "5",
      text: " Customize text color.",
    },
    {
      id: "6",
      text: " Customize text background.",
    },
    {
      id: "7",
      text: " Customize text to either align left, center or right.",
    },
    {
      id: "8",
      text: " Customize text in list format.",
    },
    {
      id: "9",
      text: " Customize text into a link.",
    },
    {
      id: "10",
      text: " embed in images and videos.",
    },
  ];
  return (
    <div>
      <nav>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="logoTitle">webTextEditor</div>
        <div className="aboutButton" onClick={aboutDialogHandler}>
          <i>i</i> <span>{aboutDialog ? "close info" : "open info"}</span>
        </div>
        {aboutDialog && (
          <div className="aboutDialog">
            <h3>webTextEditor</h3>
            <p>webTextEditor gives you the ability to :</p>
            {aboutList.map((index) => (
              <div className="list" key={index.id}>
                <span className="icon">{index.id}</span>
                <span className="defineText">{index.text}</span>
              </div>
            ))}
            <p>
              Recommended format to save your work is <b>.html </b>
            </p>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Nav;
