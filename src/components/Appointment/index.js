import React from "react";
import "components/Appointment/styles.scss"
import useVisualMode from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

  const {mode, transition, back} = useVisualMode(
      props.interview ? SHOW : EMPTY
    );

    const save = (name, interviewer) => {
      const interview = {
        student: name,
        interviewer
      };
      transition(SAVING);
      props.bookInterview(props.id, interview)
        .then(() => {
          transition(SHOW);
        })
    }

    const deleteAppointment = () => {
      transition(DELETING);

      props.cancelInterview(props.id)
        .then(() => {
          transition(EMPTY);
        })
    }

    const confirmDelete = () => {
      transition(CONFIRM);
    }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={()=>transition(CREATE)}/>}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
        />
      )}
      {mode === CREATE && (
        < Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && (
        < Status message='Saving' />
      )}
      {mode === DELETING && (
        < Status message='Deleting' />
      )}
      {mode === CONFIRM && (
        < Confirm 
          message="Are you sure you would like to delete?"
          onConfirm={deleteAppointment}
          onCancel={back} />
      )}
    </article>
  )
}