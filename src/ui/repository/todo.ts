type TodoRepositoryGetParams = {
    page: number
    limit: number
}
type TodoRepositoryGetOutput = {
    todos: Todo[]
    pages: number
    total: number
}
type Todo = {
    id: string
    date: Date
    content: string
    done: boolean
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch('api/todos').then(async (response) => {
        const { todos: ALL_TODOS } = parseTodos(await response.json())

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex)
        const totalPages = Math.ceil(ALL_TODOS.length / limit)

        return {
            todos: paginatedTodos,
            total: ALL_TODOS.length,
            pages: totalPages,
        }
    })
}

function parseTodos(response: unknown): { todos: Todo[] } {
    if (
        response !== null &&
        typeof response === 'object' &&
        'todos' in response &&
        Array.isArray(response.todos)
    ) {
        return {
            todos: response.todos.map((todo: unknown) => {
                if (todo == null && typeof todo !== 'object') {
                    throw new Error('Invalid todo')
                }

                const { id, content, done, date } = todo as Omit<
                    Todo,
                    'done'
                > & { done: string }

                return {
                    id,
                    content,
                    done: isDone(done),
                    date: new Date(date),
                }
            }),
        }
    }
    return {
        todos: [],
    }
}

function isDone(done: string) {
    return String(done).toLowerCase() === 'true'
}

export const todoRepository = {
    get,
}
