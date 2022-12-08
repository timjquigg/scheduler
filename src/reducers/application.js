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

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
  
export const reducer = (state, action) => {
  
  switch (action.type) {
    // case SET_DAY:
    //   return {...state, day: action.day};
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