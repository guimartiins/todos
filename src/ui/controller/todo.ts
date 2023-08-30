import { todoRepository } from '@ui/repository/todo'

type TodoControllerGetParams = {
    page: number
}

async function get(params: TodoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    })
}

function filterTodosByContent<T>(
    todos: Array<T & { content: string }>,
    search: string,
): T[] {
    return todos.filter((todo) => {
        const searchNormalized = search.toLowerCase()
        const contentNormalized = todo.content.toLowerCase()
        return contentNormalized.includes(searchNormalized)
    })
}

export const todoController = {
    get,
    filterTodosByContent,
}
