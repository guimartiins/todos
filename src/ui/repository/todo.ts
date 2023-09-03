import { Todo, TodoSchema } from '@ui/schema/todo'

type TodoRepositoryGetParams = {
    page: number
    limit: number
}
type TodoRepositoryGetOutput = {
    todos: Todo[]
    pages: number
    total: number
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

async function createByContent(content: string): Promise<Todo> {
    const response = await fetch('api/todos', {
        method: 'POST',
        body: JSON.stringify({
            content,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (response.ok) {
        const serverResponse = await response.json()

        const serverResponseParsed = TodoSchema.safeParse(serverResponse)
        if (!serverResponseParsed.success) {
            throw new Error('Error creating todo')
        }
        const todo = serverResponseParsed.data
        return todo
    }

    throw new Error('Error creating todo')
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
                    date,
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

async function toggleDone(id: string): Promise<Todo> {
    const response = await fetch(`api/todos/${id}/toggle-done`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (response.ok) {
        const serverResponse = await response.json()

        const serverResponseParsed = TodoSchema.safeParse(serverResponse)
        if (!serverResponseParsed.success) {
            throw new Error(`Error updating todo id - ${id}`)
        }
        const todo = serverResponseParsed.data
        return todo
    }

    throw new Error(`Error updating todo id - ${id}`)
}

export const todoRepository = {
    get,
    createByContent,
    toggleDone,
}
