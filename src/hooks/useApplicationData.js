/* import {useState, useEffect} from "react";
import axios from 'axios';

export default function useApplicationData(){
  
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({...state, day});
  
  useEffect(()=>{
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all)=> {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers:all[2].data}))
    })
    
  },[]);

  const getSpots = (state, newAppointements) => {
    const dayIndex = state.days.findIndex(day => day.name === state.day);
    const currentDay = state.days[dayIndex];
    const listOfAppointmentIds = currentDay.appointments;
  
    const listOfFreeAppointments = listOfAppointmentIds.filter(id => !newAppointements[id].interview);
  
    const spots = listOfFreeAppointments.length;
    return [dayIndex, spots];
  }
  
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const [today, spots] = getSpots(state, appointments);
    const day = {...state.days[today], spots:spots};
    const days = [...state.days];
    days.splice(today, 1, day);
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(()=> {
      setState(prev => ({...prev, appointments, days}))
    })
  }
  
  const cancelInterview = (id) => {
    const interview = null;
    const appointment = {
      ...state.appointments[id],
      interview
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const [today, spots] = getSpots(state, appointments);
    const day = {...state.days[today], spots:spots};
    const days = [...state.days]
    days.splice(today,1,day);
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState(prev => ({...prev, appointments, days}))
    })
  }



  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
 */

import {useReducer, useEffect} from "react";
import axios from 'axios';

export default function useApplicationData(){
  
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
          interview: { ...action.interview }
        };
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        return {...state, appointments}
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
  

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}