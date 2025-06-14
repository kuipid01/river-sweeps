import "./App.css";
import React, { useEffect, useState } from "react";
import TopWindows from "./TopWindows";
import * as PIXI from "pixi.js";
import { listImages } from "./common/Config";
import EventEmitter from "eventemitter3";
import { setup } from "./Game";
import { MessageWin } from "./windows/MessageWin";

// 🔊 Global Event Emitter
export const EE = new EventEmitter();

// 🎨 Global PIXI loader
export let imagesLoader: PIXI.Loader;

// 🔔 Show popup externally
export function showPopup(txt: string) {
  EE.emit("SHOW_MESSAGE", txt);
}

const App: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 🆕 Load Bronzier font
    const WebFont = require("webfontloader");
    WebFont.load({
      custom: {
        families: ["Bronzier"],
      },
    });

    const preloaderBase = document.getElementsByClassName("preloader-game");
    const preloaderBar = document.getElementsByClassName("prel-bar-line");
    const percentage = document.getElementById("percentage");

    // 🎮 Load all assets using PIXI.Loader
    imagesLoader = PIXI.Loader.shared;
    imagesLoader.add(listImages);

    imagesLoader.onProgress.add(() => {
      const wdth = (1024 * Math.ceil(100 - imagesLoader.progress)) / 100;

      if (preloaderBar[0]) {
        (preloaderBar[0] as HTMLElement).style.setProperty(
          "clip-path",
          `inset(0 ${wdth}px 0 0)`
        );
      }

      if (percentage) {
        percentage.innerText = Math.floor(imagesLoader.progress) + "%";
      }
    });

    imagesLoader.onError.add((e) => {
      console.error("ERROR LOAD!", e);
    });

    imagesLoader.onComplete.add(() => {
      if (preloaderBase[0]) {
        const baseEl = preloaderBase[0] as HTMLElement;
        baseEl.style.opacity = "0";

        setTimeout(() => {
          baseEl.style.display = "none";
          baseEl.parentNode?.removeChild(baseEl);
          EE.emit("CLEAR_TOP_WINDOWS");
          EE.emit("SHOW_LOGIN");
        }, 1000);
      }
    });

    imagesLoader.load();

    // 🎯 One-time: when "GO_GAME" is triggered, run setup
    EE.once("GO_GAME", () => {
      EE.emit("CLEAR_TOP_WINDOWS");
      setup();
    });

    // 📩 Show message listener
    const onShowMessage = (txt: string) => setMessage(txt);
    EE.addListener("SHOW_MESSAGE", onShowMessage);

    // 🧹 Cleanup
    return () => {
      EE.removeListener("SHOW_MESSAGE", onShowMessage);
    };
  }, []);

  return (
    <div>
      {message && (
        <MessageWin text={message} onClose={() => setMessage("")} />
      )}
      <TopWindows />
      <div id="AppGame" />
    </div>
  );
};

export default App;
