const fs = require('fs')
const DB_FILE_PATH = './core/db'
const uuid = require('crypto')

interface Todo {
	id: string
	content: string
	created_at: string
	done: boolean
}

function create(content: string) {
	const todo: Todo = {
		id: uuid.randomUUID(),
		content,
		created_at: new Date().toISOString(),
		done: false,
	}

	const todos: Todo[] = [...read(), todo]

	fs.writeFileSync(
		DB_FILE_PATH,
		JSON.stringify({
			todos,
		}),
		null,
		2
	)

	return todo
}

function update(id: string, todo: Partial<Todo>) {
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
		null,
		2
	)

	return todos[index]
}

function updateContentByID(id: string, todo: Partial<Todo>) {
	return update(id, todo)
}

function read(): Todo[] {
	const dbString = fs.readFileSync(DB_FILE_PATH, 'utf8')
	const db = JSON.parse(dbString || '{}')

	if (!db.todos) {
		;[]
	}

	return db.todos
}

function clearDB() {
	fs.writeFileSync(
		DB_FILE_PATH,
		JSON.stringify({
			todos: [],
		}),
		null,
		2
	)
}

clearDB()
create('Hello world')
create('Hello world 2')
const todo = create('Hello world 3')
updateContentByID(todo.id, { content: 'Hello world 3 updated' })
