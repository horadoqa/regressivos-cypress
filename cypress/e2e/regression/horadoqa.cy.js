// describe('Home do Hora do QA', () => {
//   beforeEach(() => {
//     cy.visit('/');
//   });

//   it('Deve carregar a página inicial', () => {
//     cy.title().should('include', 'Hora do QA');
//   });
// });

// describe('Teste de exemplo', () => {
//   it('Acessa o Google', () => {
//     cy.visit('https://www.google.com');
//     cy.title().should('include', 'Google');
//   });
// });

// describe('Teste de exemplo', () => {
//   it('Acessa o Google com Allure', () => {
//     cy.allure().step('Visita o Google');
//     cy.visit('https://www.google.com');
//     cy.title().should('include', 'Google');
//   });
// });

describe('Home do Hora do QA', () => {
  it('Deve carregar a página inicial', () => {
    cy.allure().label('testType', 'regression'); // etiqueta para Allure
    cy.allure().step('Visita a página inicial'); // cria passo no Allure

    cy.visit('https://www.horadoqa.com.br/');
    cy.title().should('include', 'Hora do QA');
  });
});