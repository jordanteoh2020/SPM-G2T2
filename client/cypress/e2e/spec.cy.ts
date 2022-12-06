/// <reference types="cypress" />

describe('Create a Role Form', () => {
  it('Visit the Site and Test the Role Form', () => {
    cy.visit('/ljps')
    cy.get("#createRoleBtn").contains("Create role").click();
    cy.get("#userForm_Title").type('QA Test Manager').should('have.value', 'QA Test Manager');
    cy.get("#userForm_Description").type('Ensure code quality').should('have.value', 'Ensure code quality');
    cy.get('input[aria-controls="userForm_Department_list"]').type('IT Team{enter}', {force: true})
    cy.get("#userForm_Responsibilities_0").type('Oversee end-to-end QA projects').should('have.value', 'Oversee end-to-end QA projects');
    cy.get('input[aria-controls="userForm_Skills_0_list"]').type('{downArrow}{enter}', {force: true});
    cy.get("#createRoleBtn").contains("Create role").click();
    cy.get("button").contains("Confirm").click();
  })
})

describe('Create a Skill Form', () => {
  it('Visit the Site and Test the Skill Form', () => {
    cy.visit('/ljps')
    cy.get("#rc-tabs-0-tab-skills").contains("Skills").click();
    cy.get("#createSkillBtn").contains("Create skill").click();
    cy.get("#userForm_Title").type('Research').should('have.value', 'Research');
    cy.get("#userForm_Description").type('Write Research Papers').should('have.value', 'Write Research Papers');
    cy.get("input[aria-controls='userForm_Courses_0_list']").type('{downArrow}{downArrow}{enter}', {force: true});
    cy.get("#userForm_Active").click();
    cy.get("#createSkillBtn").contains("Create skill").click();
    cy.get("button").contains("Confirm").click();
  })
})
