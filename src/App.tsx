import React, { useState, useEffect } from "react";
import "./App.css";
import Text from "./components/text/Text";
import Chart from "react-apexcharts";
import { ReactMic } from "react-mic";

const SpeechRecognition = (window as any).webkitSpeechRecognition;

interface Controls {
  volume: string;
}

const App = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [said, setSaid] = useState<string>("");
  const [volume, setVolume] = useState<number>(0);

  const recognition = new SpeechRecognition() as SpeechRecognition;
  recognition.lang = "en-us";

  const talk = (msg: string) => {
    const speech = new SpeechSynthesisUtterance();
    speech.volume = volume / 100;
    speech.pitch = 0;
    speech.text = msg;
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const controls = localStorage.getItem("controls");
    if (controls) {
      const parsed = JSON.parse(controls) as Controls;
      setVolume(parseInt(parsed.volume));
    } else {
      setVolume(45);
    }
  }, []);

  useEffect(() => {
    if (started) {
      setSaid("");
    }
  }, [started]);

  useEffect(() => {
    localStorage.setItem("controls", JSON.stringify({ volume: volume }));
  }, [volume]);

  recognition.onstart = () => {
    setStarted(true);
    console.log("voice started");
  };

  recognition.onspeechend = (e) => {
    setStarted(false);
    console.log("stop");
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    console.log(event);
    setSaid(event.results[0][0].transcript);
    talk(event.results[0][0].transcript);
  };

  recognition.onnomatch = (e) => {
    console.log(e);
  };

  return (
    <>
      <div className="app">
        <h1>Alan</h1>
        <div className="volume-control">
          <label htmlFor="vol">Volume ({volume}%): </label>
          <input
            id="vol"
            type="range"
            value={volume}
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="btn-wrapper">
          <button
            disabled={started ? true : false}
            onClick={() => {
              recognition.start();
            }}
            className="alan-btn"
          >
            {started ? "Listening..." : "Start Alan"}
          </button>
          <button
            onClick={() => {
              talk("Test");
            }}
            className="alan-btn"
          >
            Say something
          </button>
        </div>
        <div className="said">
          <Text text={said} />
        </div>
        <div className="vs">
          <ReactMic
            record={started}
            className="sound-wave"
            strokeColor="#6060fc"
            backgroundColor="#fff"
            visualSetting="frequencyBars"
          />
        </div>
        <div className="charts">
          <Chart
            options={{
              labels: [
                "something posh",
                "something posh",
                "something posh",
                "something posh",
              ],
              colors: ["#fca503", "#03b1fc", "#a503fc", "#4de37a"],
            }}
            series={[40, 40, 30, 20]}
            type="pie"
            height="450"
            width="350"
          />
          <Chart
            options={{
              labels: [
                "something posh",
                "something posh",
                "something posh",
                "something posh",
              ],
              colors: ["#fca503", "#4de37a", "#03b1fc", "#a503fc"],
            }}
            series={[40, 40, 30, 20]}
            type="donut"
            height="450"
            width="350"
          />
          <Chart
            options={{
              labels: [
                "something posh",
                "something posh",
                "something posh",
                "something posh",
              ],
              colors: ["#fca503", "#03b1fc", "#a503fc", "#4de37a"],
            }}
            series={[40, 40, 30, 20]}
            type="pie"
            height="450"
            width="350"
          />
          <Chart
            options={{
              labels: [
                "something posh",
                "something posh",
                "something posh",
                "something posh",
              ],
              colors: ["#fca503", "#4de37a", "#03b1fc", "#a503fc"],
            }}
            series={[40, 40, 30, 20]}
            type="donut"
            height="450"
            width="350"
          />
        </div>
      </div>
    </>
  );
};

export default App;
