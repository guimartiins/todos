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
    return fetch(`api/todos?page=${page}&limit=${limit}`).then(
        async (response) => {
            const parsedResponse = parseTodos(await response.json())

            return {
                todos: parsedResponse.todos,
                total: parsedResponse.total,
                pages: parsedResponse.pages,
            }
        },
    )
}

function parseTodos(response: unknown): {
    todos: Todo[]
    total: number
    pages: number
} {
    if (
        response !== null &&
        typeof response === 'object' &&
        'todos' in response &&
        'total' in response &&
        'pages' in response &&
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
            total: Number(response.total),
            pages: Number(response.pages),
        }
    }
    return {
        todos: [],
        total: 0,
        pages: 1,
    }
}

function isDone(done: string) {
    return String(done).toLowerCase() === 'true'
}

export const todoRepository = {
    get,
}
