import { NextApiRequest, NextApiResponse } from 'next'
import { todoController } from '@server/controller/todo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return todoController.get(req, res)
    }

    return res.status(405).json({
        error: 'method not allowed',
    })
}
