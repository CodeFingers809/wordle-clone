import Head from "next/head";
import { useState, useEffect } from "react";
import words from "../public/words";

export default function Home() {
  let keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Del"],
  ];
  const [display, setDisplay] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(-1);
  const [ended, setEnded] = useState(false);
  const [same, setSame] = useState(false);
  const [randomWord, setRandomWord] = useState("");

  useEffect(() => {
    setRandomWord(
      words.wordArr[Math.round(Math.random() * words.wordArr.length)]
    );
  }, []);

  function handleKeyClick(ev) {
    let button = ev.target;
    let key = button.innerText;
    if (key === "Enter") {
      handleEnter();
      return;
    }
    if (key === "Del") {
      handleDelete();
      return;
    }
    if (currentLetter === 4) {
      return;
    }
    const tempLetter = currentLetter + 1;
    setCurrentLetter(tempLetter);
    const temp = [...display];
    temp[currentRow][tempLetter] = key;
    setDisplay(temp);
    document.querySelector(`#tile${currentRow}${tempLetter}`).innerText =
      temp[currentRow][tempLetter];
  }

  function handleDelete() {
    if (currentLetter - 1 < -1) return;
    const temp = [...display];
    temp[currentRow][currentLetter] = "";
    setCurrentLetter((c) => c - 1);
  }

  function handleEnter() {
    if (currentLetter !== 4) return;
    if (!words.wordArr.includes(display[currentRow].join("").toLowerCase()))
      return;
    if (display[currentRow].join("") === randomWord.toUpperCase()) {
      handleSame();
      return;
    }
    if (currentRow === 5) {
      setEnded(true);
      return;
    }
    setCurrentRow((c) => c + 1);
    setCurrentLetter(-1);
    handleNotSame();
  }

  function handleSame() {
    setSame(true);
    setEnded(true);
    handleColor(randomWord);
  }

  const handleColor = (currentWord) => {
    for (let tile = 0; tile < currentWord.length; tile++) {
      const letter = currentWord.charAt(tile);
      if (letter === randomWord.charAt(tile)) {
        document.querySelector(
          `#tile${currentRow}${tile}`
        ).style.backgroundColor = "green";
        continue;
      }
      if (randomWord.includes(letter)) {

        document.querySelector(
          `#tile${currentRow}${tile}`
        ).style.backgroundColor = "yellow";
        continue;
      }
      document.querySelector(
        `#tile${currentRow}${tile}`
      ).style.backgroundColor = "gray";
    }
  };

  function handleNotSame() {
    setSame(false);
    let currentWord = display[currentRow].join("").toLowerCase();
    handleColor(currentWord);
  }
  function handleAgain() {
    const temp = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    handleErazeColors();
    setCurrentLetter(-1);
    setCurrentRow(0);
    setDisplay(temp);
    setRandomWord(
      words.wordArr[Math.round(Math.random() * words.wordArr.length)]
    );
    setEnded(false);
  }
  function handleErazeColors() {
    document
      .querySelectorAll(".tile")
      .forEach((tile) => (tile.style.backgroundColor = "transparent"));
  }
  return (
    <div>
      <Head>
        <title>Wordle Clone</title>
        <meta name="title" content="Wordle Clone" />
        <meta
          name="description"
          content="An Endless version of the original wordle!"
        />
        <meta
          name="keywords"
          content="wordle, wordle game, wordle clone, clone, endless, endless game, word game, words"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Ayush Bohra" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="gameContainer absolute top-0 right-0 flex flex-col items-center justify-start h-screen w-screen p-4 pt-0">
        {/* nav */}
        <header className="text-white bg-gray-900 body-font border-b-2 border-gray-500 w-screen">
          <div className="titleContainer w-full text-center  py-2">
            <span className="ml-3 text-3xl font-bold text-center">Wordle</span>
          </div>
        </header>
        {/* tiles */}
        <div className="tileContainer w-screen flex flex-col items-center justify-center">
          {display.map((el, ri) => {
            return (
              <div
                key={ri}
                className="h-[33px] sm:h-[66px] flex items-center justify-center m-0.5"
              >
                {el.map((tile, ti) => {
                  return (
                    <div
                      key={"tile" + ti}
                      id={`tile${ri}${ti}`}
                      className="tile h-[33px] w-[33px] sm:h-[66px] sm:w-[66px] 
                  border-[2px] sm:border-2 border-white/30 m-0.5 flex items-center justify-center text-center text-white text-lg sm:text-3xl font-semibold"
                    >
                      {display[ri][ti]}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* message screen */}
        <div
          className={`messageContainer text-white text-center font-semibold ${
            ended ? "" : "hidden"
          }`}
        >
          <p className={`${same ? "" : "hidden"}`}>You got it ma Boii!</p>
          <p className={`${same ? "hidden" : ""}`}>
            You did not get it ma Boii :(. The answer was: {randomWord}
          </p>
          <button
            className="bg-indigo-500 px-4 py-2 mt-2 rounded-lg"
            onClick={handleAgain}
          >
            Again!
          </button>
        </div>
        {/* keyboard */}
        <div
          className={`keyContainer flex flex-col items-center ${
            ended ? "hidden" : ""
          }`}
        >
          {keys.map((key, i) => {
            return (
              <div className="flex" key={i}>
                {key.map((k, i) => {
                  return (
                    <button
                      key={k}
                      className="bg-gray-500 p-1.5 sm:p-3 text-white rounded m-0.5 sm:m-1"
                      onClick={handleKeyClick}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
