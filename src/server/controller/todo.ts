import { read } from '@core/crud'
import { NextApiRequest, NextApiResponse } from 'next'

function get(_req: NextApiRequest, res: NextApiResponse) {
    const todos = read()

    res.status(200).json({
        todos,
    })
}

export const todoController = {
    get,
}
