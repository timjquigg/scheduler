import React from "react";
import "components/Appointment/styles.scss"
import useVisualMode from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

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
        .then(() => transition(SHOW))
        .catch((error) => transition(ERROR_SAVE, true))
    }

    const deleteAppointment = () => {
      transition(DELETING, true);

      props.cancelInterview(props.id)
        .then(() => transition(EMPTY))
        .catch((error)=> transition(ERROR_DELETE, true));
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
          onEdit={(()=>transition(EDIT))}
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
      {mode === EDIT && (
        < Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === ERROR_DELETE && (
        < Error
          message="Error on deleting"
          onClose={back}
        />
      )}
      {mode === ERROR_SAVE && (
        < Error
          message="Error on saving"
          onClose={back}
        />
      )}
    </article>
  )
}