import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

interface Props{
    time: number
    setTime: Dispatch<SetStateAction<number>>
    isRunning: boolean
    validateRequisition: () => void
}

const Stopwatch = ({
    isRunning,
    setTime,
    time,
    validateRequisition
}:Props) => {
  // state to store time

  // state to check stopwatch running or not

  useEffect(() => {
    let intervalId: any;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time - 1), 10);
      validateRequisition()
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Hours calculation
  const hours = Math.floor(time / 360000);

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;

  
  return (
    <div className="stopwatch-container">
      <p className="text-center text-blue-400 text-3xl">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      </p>
      {/* <div className="stopwatch-buttons">
        <button className="stopwatch-button" onClick={startAndStop}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button className="stopwatch-button" onClick={reset}>
          Reset
        </button>
      </div> */}
    </div>
  );
};

export default Stopwatch;