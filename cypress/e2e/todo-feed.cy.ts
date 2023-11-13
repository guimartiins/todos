const BASE_URL = 'http://localhost:3000'

describe('Todo Feed', () => {
    it('when load, renders the page', () => {
        cy.visit(BASE_URL)
    })
    it('when create a new todo, renders the new todo', () => {
        // mocking request
        cy.intercept('POST', `${BASE_URL}/api/todos`, (request) => {
            request.reply({
                statusCode: 201,
                body: {
                    id: '785a0ca1-625e-4114-9e6b-287ddec529e3',
                    content: 'new todo',
                    date: '2023-09-03T21:34:49.222Z',
                    done: true,
                },
            })
        }).as('createTodo')

        cy.visit(BASE_URL)
        cy.get("input[name='add-todo']").type('New Todo')
        cy.get("button[aria-label='Adicionar novo item']").click()

        cy.get('table > tbody').contains('new todo')
    })
})
