import {useReducer, useEffect} from "react";
import axios from 'axios';


export default function useApplicationData(){
  
  const getSpots = (state, newAppointments) => {
    const dayIndex = state.days.findIndex(day => day.name === state.day);
    const currentDay = state.days[dayIndex];
    const listOfAppointmentIds = currentDay.appointments;
  
    const listOfFreeAppointments = listOfAppointmentIds.filter(id => !newAppointments[id].interview);
  
    const spots = listOfFreeAppointments.length;
    const day = {...state.days[dayIndex], spots: spots}
    const days = [...state.days];
    days.splice(dayIndex, 1, day);
    return days;
  }
  
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  
  const reducer = (state, action) => {
    
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day};
      case SET_APPLICATION_DATA:
        return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers};
      case SET_INTERVIEW: {
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview
        };
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        const days = getSpots(state, appointments);
        return {...state, appointments, days}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

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