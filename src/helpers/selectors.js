export function getAppointmentsForDay(state, day) {
  
  const dayArray = (state.days.filter(stateDay => {
    return stateDay.name === day; 
  }));

  if (dayArray.length === 0){
    return dayArray;
  }

  const appointmentIds = dayArray[0].appointments;

  const appointments = appointmentIds.map(id => {
    return state.appointments[id]
  });
  return appointments;
}

export function getInterview(state, interview) {

  if (!interview){
    return null
  }
  
  const interviewer = state.interviewers[interview.interviewer];
  return {...interview, interviewer:interviewer};
  
}