import { read } from '@core/crud'

type TodoRepositoryGetParams = {
    page?: number
    limit?: number
}

function get(
    { page, limit }: TodoRepositoryGetParams = {
        page: 1,
        limit: 2,
    },
) {
    return {
        todos: read(),
    }
}

export const todoRepository = {
    get,
}
