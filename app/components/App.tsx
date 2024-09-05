"use client";

import { useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider";
import Visualizer from "./Visualizer";
import {
  DeepGramModel,
  GroqModel,
  deepgramModels,
  groqModels,
} from "../models";
import { set } from "zod";

const DEFAULT_PROMPT =
  "I will provide you a text in English. Please correct grammar, punctuation and remove filler words and then translate this English text to Polish";

const App: () => JSX.Element = () => {
  const [caption, setCaption] = useState<string | undefined>("Start talking");
  const [total, setTotal] = useState<string | undefined>("");
  const [result, setResult] = useState<string | undefined>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [selectedGroqModel, setSelectedGroqModel] =
    useState<GroqModel>("llama3-8b-8192");
  const [selectedDgModel, setSelectedDgModel] =
    useState<DeepGramModel>("nova-2-general");
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();
  const [customPrompt, setCustomPrompt] = useState<string>(DEFAULT_PROMPT);

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAll = () => {
    setCaption("Start talking");
    setTotal("");
    setResult("");
    setResponseTime(null);
    setSelectedGroqModel("llama3-8b-8192");
    setSelectedDgModel("nova-2-general");
    setCustomPrompt(DEFAULT_PROMPT);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      const controller = new AbortController();
      const signal = controller.signal;
      if (total !== "") {
        try {
          const response = await fetch("/api/completion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: `${customPrompt}
              Here is the input text.
              "${total}"
              return only the final result, don't add any comments and explanations, ONLY the translated text!!!
              Write result below:`,
              model: selectedGroqModel,
            }),
            signal,
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setResponseTime(data.responseTime);
          setResult(data.text);
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Fetch error:", error);
          }
        }
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [total, selectedGroqModel, customPrompt]);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: selectedDgModel,
        // interim_results: true,
        smart_format: true,
        filler_words: true,
        // utterance_end_ms: 1000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, selectedDgModel]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      connection?.send(e.data);
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      if (thisCaption !== "") {
        setCaption(thisCaption);
        setTotal((old) => `${old} ${thisCaption}`);
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
          clearTimeout(captionTimeout.current);
        }, 200);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

  return (
    <>
      <div className="flex h-full antialiased">
        <div className="flex flex-row h-full w-full max-w-[1700px] overflow-x-hidden mx-auto">
          <div className="flex flex-col flex-auto h-full w-1/3 border-r p-4 border-gray-300">
            <div className="relative w-full h-full">
              {microphone && <Visualizer microphone={microphone} />}
              <div className="mt-8 max-w-4xl mx-auto text-center">
                {caption && (
                  <p className="bg-black/70 p-2 rounded-lg">{caption}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full w-1/3 p-4 text-black border-r border-gray-300">
            <div className="mb-4">
              <label htmlFor="modelSelect" className="font-bold mb-3 block">
                Select DeepGram Model:
              </label>
              <select
                id="dgModelSelect"
                className="p-2 border rounded bg-white w-full"
                onChange={(e) => setSelectedDgModel(e.target.value)}
              >
                {deepgramModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 text-sm">
              <p className="font-bold mb-3 text-sm">Transcription:</p>
              <p>{total}</p>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full w-1/3 p-4 text-black">
            <div className="mb-4">
              <label htmlFor="groqModelSelect" className="font-bold mb-3 block">
                Select Groq Model:
              </label>
              <select
                id="groqModelSelect"
                className="p-2 border rounded bg-white w-full"
                onChange={(e) => setSelectedGroqModel(e.target.value)}
              >
                {groqModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="customPrompt" className="font-bold mb-3 block">
                Enter Custom Prompt:
              </label>
              <textarea
                id="customPrompt"
                className="p-2 border rounded bg-white w-full"
                rows="4"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
            <div className="mb-8 text-sm">
              <p className="font-bold mb-3">Result:</p>
              <p>{result}</p>
            </div>
            <div className="text-sm">
              <p className="font-bold mb-3">Response time:</p>
              {responseTime && <p>{responseTime} ms</p>}
            </div>
          </div>
        </div>
        <button
          onClick={resetAll}
          className="fixed bottom-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 focus:outline-none"
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default App;
