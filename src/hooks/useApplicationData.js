import {useReducer, useEffect} from "react";
import axios from 'axios';
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";


export default function useApplicationData(){

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => dispatch({type: SET_DAY, day});
  
  useEffect(()=>{
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all)=> {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({type: SET_APPLICATION_DATA, days, appointments, interviewers});
    })
    
  },[]);
  
  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(()=> {
      dispatch({type: SET_INTERVIEW, id, interview});
    })
    
  }
  
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
    .then(()=> {
    return dispatch({type: SET_INTERVIEW, id, interview: null})
    })
  };

  useEffect(() => {
  
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'SET_INTERVIEW') {
          const type = data.type;
          const id = data.id || null;
          const interview = data.interview || null
          dispatch({type, id, interview});
        }

      }
      
    return (()=> ws.close());
  },[])

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}