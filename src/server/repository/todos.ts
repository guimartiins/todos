import { read } from '@core/crud'

type Todo = {
    id: string
    date: string
    content: string
    done: boolean
}

type TodoRepositoryGetParams = {
    page?: number
    limit?: number
}

type TodoRepositoryGetOutput = {
    todos: Todo[]
    pages: number
    total: number
}

function get(
    { page, limit }: TodoRepositoryGetParams = {
        page: 1,
        limit: 2,
    },
): TodoRepositoryGetOutput {
    const currentPage = page || 1
    const currentLimit = limit || 2
    const ALL_TODOS = read()

    const startIndex = (currentPage - 1) * currentLimit
    const endIndex = currentPage * currentLimit

    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex)
    const totalPages = Math.ceil(ALL_TODOS.length / currentLimit)

    return {
        todos: paginatedTodos,
        total: ALL_TODOS.length,
        pages: totalPages,
    }
}

export const todoRepository = {
    get,
}
