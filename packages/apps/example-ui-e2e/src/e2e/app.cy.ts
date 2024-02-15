describe('example-ui-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display hell world message', () => {
    cy.get('h1').contains('Hello world!');
  });
});
