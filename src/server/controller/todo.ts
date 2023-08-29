import { todoRepository } from '@server/repository/todos'
import { NextApiRequest, NextApiResponse } from 'next'

function get(_req: NextApiRequest, res: NextApiResponse) {
    const output = todoRepository.get()
    res.status(200).json({
        todos: output.todos,
    })
}

export const todoController = {
    get,
}
