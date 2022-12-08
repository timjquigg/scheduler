import React from "react";

import {
  render, 
  cleanup, 
  waitForElement, 
  fireEvent, 
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  getByDisplayValue
} from "@testing-library/react";

import Application from "components/Application";

import axios from 'axios';

afterEach(cleanup);

describe('Application', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const {getByText} = render(<Application />);
    
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const {container} = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    
    await waitForElement(() => queryByText(appointment, 'Sylvia Palmer'));
    expect(getByText(appointment, 'Sylvia Palmer')).toBeInTheDocument();

    const days = getAllByTestId(container, 'day');
    const day = days.find(day => queryByText(day,'Monday'));
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  })

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument();
    
    fireEvent.click(getByText(appointment, 'Confirm'));
    
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();
    
    await waitForElement(() => getByAltText(appointment, 'Add'));
    
    const days = getAllByTestId(container, 'day');
    const day = days.find(day => queryByText(day,'Monday'));
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );
    
    fireEvent.click(getByAltText(appointment, 'Edit'));
    
    fireEvent.change(getByDisplayValue(appointment, 'Archie Cohen'), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    
    await waitForElement(() => queryByText(appointment, 'Sylvia Palmer'));
    expect(getByText(appointment, 'Sylvia Palmer')).toBeInTheDocument();

    const days = getAllByTestId(container, 'day');
    const day = days.find(day => queryByText(day,'Monday'));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const {container} = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    
    fireEvent.click(getByText(appointment, 'Save'));

    await waitForElement(() => queryByText(appointment, /Error on saving/i));
    expect(getByText(appointment, /error on saving/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument();
    
    fireEvent.click(getByText(appointment, 'Confirm'));
    
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, /Error on deleting/i));
    expect(getByText(appointment, /error on deleting/i)).toBeInTheDocument();
  })
});
  