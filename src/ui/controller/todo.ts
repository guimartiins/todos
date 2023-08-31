import { todoRepository } from '@ui/repository/todo'
import { Todo } from '@ui/schema/todo'
import { z as schema } from 'zod'

type TodoControllerGetParams = {
    page: number
}

type TodoControllerCreateParams = {
    content?: string
    onError: () => void
    onSuccess: (todo: Todo) => void
}

async function get(params: TodoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    })
}

function filterTodosByContent<T>(
    todos: Array<T & { content?: string }>,
    search: string,
): T[] {
    return todos.filter((todo) => {
        const searchNormalized = search.toLowerCase()
        const contentNormalized = todo.content.toLowerCase()
        return contentNormalized.includes(searchNormalized)
    })
}

function create({ content, onError, onSuccess }: TodoControllerCreateParams) {
    const parsedContent = schema.string().nonempty().safeParse(content)
    if (!parsedContent.success) {
        onError()
        return
    }
    todoRepository
        .createByContent(parsedContent.data)
        .then((todo) => {
            onSuccess(todo)
        })
        .catch(() => {
            onError()
        })
}

export const todoController = {
    get,
    filterTodosByContent,
    create,
}
