import { todoRepository } from '@server/repository/todos'
import { NextApiRequest, NextApiResponse } from 'next'

function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query
    const output = todoRepository.get(query)
    res.status(200).json(output)
}

export const todoController = {
    get,
}
