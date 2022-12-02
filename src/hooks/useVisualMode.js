import { useState } from "react"

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setHistory(prev=>{
      if (replace) {
        prev.pop();
      }
      return [...prev, newMode]
    });
    setMode(newMode);
  } 

  const back = () => {
    setHistory(prev => {
      if(prev.length <=1){
        return [...prev];
      }
      prev.pop();
      setMode(prev[prev.length-1]);
      return [...prev];
    });
  };

  return {mode, transition, back}
}

