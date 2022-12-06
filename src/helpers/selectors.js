export function getAppointmentsForDay(state, day) {
  
  const dayArray = (state.days.find(stateDay => stateDay.name === day) || {});

  const appointmentIds = (dayArray.appointments || []);

  const appointments = appointmentIds.map(id => state.appointments[id]);
  
  return appointments;
}

export function getInterviewersForDay(state, day) {
  
  const dayArray = (state.days.find(stateDay => stateDay.name === day) || {});

  const appointmentIds = (dayArray.interviewers || []);

  const appointments = appointmentIds.map(id => {
    return state.interviewers[id]
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

export function getSpots(state, newAppointements) {
  const dayIndex = state.days.findIndex(day => day.name === state.day);
  const currentDay = state.days[dayIndex];
  const listOfAppointmentIds = currentDay.appointments;

  const listOfFreeAppointments = listOfAppointmentIds.filter(id => !newAppointements[id].interview);

  const spots = listOfFreeAppointments.length;
  return [dayIndex, spots];
}