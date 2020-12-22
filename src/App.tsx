import React, { useState, useEffect } from "react";
import "./App.css";
import Text from "./components/text/Text";
import Chart from "react-apexcharts";
import { ReactMic } from "react-mic";

const SpeechRecognition = (window as any).webkitSpeechRecognition;

interface Controls {
  volume: string;
}

interface Intent {
  id: string;
  name: string;
  confidence: number;
}

interface WitAiResponse {
  res: {
    entities: {};
    intents: Intent[];
    text: string;
    traits: any;
  };
}

interface Response {
  text: string;
}

interface ResponseType {
  name: string;
  possibleResponses: Response[];
}

const responseTypes: ResponseType[] = [
  {
    name: "wit$greetings",
    possibleResponses: [
      {
        text: "hey",
      },
      {
        text: "hello there",
      },
      {
        text: "Hola",
      },
      {
        text: "what's up?",
      },
      {
        text: "yo",
      },
    ],
  },
  {
    name: "wit$get_time",
    possibleResponses: [
      {
        text: `${new Date().toLocaleTimeString([], {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      },
    ],
  },
];

const App = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [said, setSaid] = useState<string>("");
  const [volume, setVolume] = useState<number>(0);
  const [voices, setVoices] = useState<any[]>([]);

  const recognition = new SpeechRecognition() as SpeechRecognition;
  recognition.lang = "en-us";

  const talk = (msg: string) => {
    const speech = new SpeechSynthesisUtterance();
    speech.volume = volume / 100; // Need to divide by 100 becuase the volume has to be between 0 - 1
    speech.pitch = 0;
    speech.text = msg;
    speech.voice = voices[2];
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    setVoices([...window.speechSynthesis.getVoices()]);
  }, []);

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

  recognition.onresult = async (event: SpeechRecognitionEvent) => {
    const newSaid = event.results[0][0].transcript;
    setSaid(newSaid);
    const res = await fetch(`http://localhost:4500/chat?msg=${newSaid}`);
    const json = (await res.json()) as WitAiResponse;

    console.log(json);

    const traits = json.res.traits;
    const intents = json.res.intents;

    responseTypes.forEach((responseType) => {
      if (responseType.name in traits) {
        const idx = Math.floor(
          Math.random() * responseType.possibleResponses.length
        );

        talk(responseType.possibleResponses[idx].text);
      } else {
        intents.forEach((intent) => {
          if (intent.name.includes(responseType.name)) {
            const idx = Math.floor(
              Math.random() * responseType.possibleResponses.length
            );

            talk(responseType.possibleResponses[idx].text);
          }
        });
      }
    });
  };

  recognition.onnomatch = (e) => {
    console.log(e);
  };

  return (
    <>
      <div className="app">
        <h1>Alan</h1>
        <div className="controls">
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
              talk("hey Alan");
            }}
            className="alan-btn"
          >
            Repeat
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
        </div>
      </div>
    </>
  );
};

export default App;
