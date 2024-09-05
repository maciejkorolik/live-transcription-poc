import React, { useEffect, useRef } from "react";

const interpolateColor = (
  startColor: number[],
  endColor: number[],
  factor: number
): number[] => {
  const result = [];
  for (let i = 0; i < startColor.length; i++) {
    result[i] = Math.round(
      startColor[i] + factor * (endColor[i] - startColor[i])
    );
  }
  return result;
};

const Visualizer = ({ microphone }: { microphone: MediaRecorder }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  useEffect(() => {
    const source = audioContext.createMediaStreamSource(microphone.stream);
    source.connect(analyser);

    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = (): void => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.style.width = "100%";
    canvas.style.height = "50%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);
    const halfLength = Math.floor(dataArray.length / 2);
    const firstHalf = dataArray.slice(0, halfLength);
    const reversedHalf = firstHalf.slice(0, -1).reverse();
    const modifiedDataArray = new Uint8Array([...firstHalf, ...reversedHalf]);

    if (!context) return;

    context.clearRect(0, 0, width, height);

    const radius = Math.min(width, height) / 2;

    const numBands = 20;
    const bandWidth = modifiedDataArray.length / numBands;

    context.beginPath();
    context.moveTo(width / 2, height / 2 - 100);

    const points = [];
    for (let i = 0; i < numBands; i++) {
      const startIndex = Math.floor(i * bandWidth);
      const endIndex = Math.floor((i + 1) * bandWidth);
      const bandData = modifiedDataArray.slice(startIndex, endIndex);
      const average = bandData.reduce((a, b) => a + b, 0) / bandData.length;
      const bandRadius = (average / 255) * 50 + 100;

      const angle = (i / numBands) * 2 * Math.PI;
      const x = width / 2 + Math.cos(angle) * bandRadius;
      const y = height / 2 + Math.sin(angle) * bandRadius;

      points.push({ x, y });
    }

    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });

    context.closePath();
    context.filter = "blur(20px)";
    context.fillStyle = `rgba(0,0,0,0.9)`;
    context.fill();
    context.filter = "none";
  };

  return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
};

export default Visualizer;
