import { todoRepository } from '@server/repository/todos'
import { NextApiRequest, NextApiResponse } from 'next'
import { z as schema } from 'zod'

const TodoCreateSchema = schema.object({
    content: schema.string(),
})

async function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query
    const output = todoRepository.get(query)
    res.status(200).json(output)
}

async function create(req: NextApiRequest, res: NextApiResponse) {
    const body = TodoCreateSchema.safeParse(req.body)

    if (body.success === false) {
        res.status(400).json({
            error: {
                message: 'You need to provide a content to create a TODO.',
                reason: body.error.issues,
            },
        })
        return
    }

    const output = await todoRepository.createByContent(body.data.content)
    res.status(201).json(output)
}

export const todoController = {
    get,
    create,
}
