/// <reference types="cypress" />

describe('Home do Hora do QA', () => {
  beforeEach(() => {
    cy.visit('https://horadoqa.com.br')
  })

  it('Deve carregar a página inicial', () => {
    cy.contains('Hora do QA')
  })
})