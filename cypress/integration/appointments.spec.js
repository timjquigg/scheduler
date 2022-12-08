describe("Appointments", () => {

  beforeEach(() => {

    // Reset API server DB
    cy.request('GET', '/api/debug/reset');
    // Visit page and confirm it has loaded
    cy.visit("/");
    cy.contains('[data-testid=day]', 'Monday')
    
  })
  it('should book an interview', () => {

    // Click button to add appointment
    cy.get('[alt=Add]')
    .first()
    .click();
    // Enter student name
    cy.get('[data-testid=student-name-input]')
    .type('Lydia Miller-Jones');
    // Select interviewer
    cy.get("[alt='Sylvia Palmer']")
    .click();
    // Click Save button
    cy.contains('button', 'Save')
    .click()
    // Should show the Saving indicator
    cy.contains('Saving').should('exist')
    // Should no longer show the saving indicator
    cy.contains('Saving').should('not.exist')

    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  })
  
  it('should edit an interview', () => {
    
    // Click button to edit appointment
    cy.get('[alt=Edit]')
    .first()
    .click({force: true});
    // Re-enter student
    cy.get('[data-testid=student-name-input]')
    .clear()
    .type('Lydia Miller-Jones');
    // Edit Interviewer
    cy.get("[alt='Tori Malcolm']")
    .click();
    // Click Save button
    cy.contains('button', 'Save')
    .click();
    // Should show the Saving indicator
    cy.contains('Saving').should('exist')
    // Should no longer show the saving indicator
    cy.contains('Saving').should('not.exist')
    
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  })

  it('should cancel an interview', () => {
    
    // Click button to delete an appointment
    cy.get('[alt=Delete]')
    .first()
    .click({force: true});

    // Click the confirm button
    cy.contains('button', 'Confirm')
    .click()

    // Should show the deleting indicator
    cy.contains('Deleting').should('exist')
    // Should no longer show the deleting indicator
    cy.contains('Deleting').should('not.exist')

    // Should no longer show delecting indicator
    cy.contains('.appointment__card--show', 'Archie Cohen').should('not.exist');

  })
})