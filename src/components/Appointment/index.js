import React, {useEffect} from "react";
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

  const {id, time, interview, interviewers, bookInterview, cancelInterview} = props;

  const {mode, transition, back} = useVisualMode(
      interview ? SHOW : EMPTY
    );

  useEffect(() => {
    if (interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [interview, transition, mode]);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true))
  }

  const deleteAppointment = () => {
    transition(DELETING, true);

    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch((error)=> transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={()=>transition(CREATE)}/>}
      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={(()=>transition(EDIT))}
          onDelete={()=>transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
        < Form
          interviewers={interviewers}
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
          student={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
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