import * as fs from 'fs'
const DB_FILE_PATH = './core/db'
import { randomUUID } from 'crypto'

type UUID = string
interface Todo {
    id: UUID
    content: string
    date: string
    done: boolean
}

export function create(content: string) {
    const todo: Todo = {
        id: randomUUID(),
        content,
        date: new Date().toISOString(),
        done: false,
    }

    const todos: Todo[] = [...read(), todo]

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify({
            todos,
        }),
    )

    return todo
}

export function update(id: UUID, todo: Partial<Todo>) {
    const todos = read()
    const index = todos.findIndex((t) => t.id === id)

    if (index === -1) {
        throw new Error('Todo not found')
    }

    todos[index] = {
        ...todos[index],
        ...todo,
    }

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify({
            todos,
        }),
    )

    return todos[index]
}

export function updateContentByID(id: UUID, todo: Partial<Todo>) {
    return update(id, todo)
}

export function read(): Todo[] {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf8')
    const db = JSON.parse(dbString || '{}')

    if (!db.todos) {
        return []
    }

    return db.todos
}

export function deleteByID(id: UUID) {
    const todos = read()
    const index = todos.findIndex((t) => t.id === id)

    if (index === -1) {
        throw new Error('Todo not found')
    }

    const todo = todos[index]
    todos.splice(index, 1)

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify({
            todos,
        }),
    )

    return todo
}

export function clearDB() {
    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify({
            todos: [],
        }),
    )
}
