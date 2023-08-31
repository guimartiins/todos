import { NextApiRequest, NextApiResponse } from 'next'
import { todoController } from '@server/controller/todo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return todoController.get(req, res)
    }

    if (req.method === 'POST') {
        return todoController.create(req, res)
    }
    return res.status(405).json({
        error: 'method not allowed',
    })
}
