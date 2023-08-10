const fs = require('fs')
const DB_FILE_PATH = './core/db'

interface Todo {
	content: string
	created_at: string
	done: boolean
}

function create(content: string) {
	const todo: Todo = {
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
