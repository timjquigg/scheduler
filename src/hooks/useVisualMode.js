import { useState } from "react"

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setHistory(prev => replace ? [...prev.slice(0,-1), newMode] : [...prev, newMode]);
  } 

  const back = () => {
      if (history.length <= 1) return;
      setHistory(prev => [...prev.slice(0,-1)]);
  };

  const mode = history[history.length - 1];
  return {mode, transition, back}
}