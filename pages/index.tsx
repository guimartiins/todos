import React, { useRef } from 'react'
import { GlobalStyles } from '@ui/theme/GlobalStyles'
import { useState } from 'react'
import { useEffect } from 'react'
import { todoController } from '../src/ui/controller/todo'
import { Todo } from '@ui/schema/todo'

function Home() {
    const initialLoadComplete = useRef(false)
    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [todos, setTodos] = useState<Todo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newTodoContent, setNewTodoContent] = useState('')
    const hasMorePages = page < totalPages

    const homeTodos = todoController.filterTodosByContent<Todo>(todos, search)
    const hasNoTodos = homeTodos.length === 0 && !isLoading

    useEffect(() => {
        if (!initialLoadComplete.current) {
            todoController
                .get({ page })
                .then(({ todos, pages }) => {
                    setTodos(todos)
                    setTotalPages(pages)
                })
                .finally(() => {
                    setIsLoading(false)
                    initialLoadComplete.current = true
                })
        }
    }, [])

    return (
        <main>
            <GlobalStyles />
            <header>
                <div className="typewriter">
                    <h1>O que fazer hoje?</h1>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        todoController.create({
                            content: newTodoContent,
                            onError() {
                                alert('content required')
                            },
                            onSuccess(todo: Todo) {
                                setTodos((t) => [...t, todo])
                                setNewTodoContent('')
                            },
                        })
                    }}
                >
                    <input
                        type="text"
                        placeholder="Correr, Estudar..."
                        value={newTodoContent}
                        onChange={function newTodoHandler(event) {
                            setNewTodoContent(event.target.value)
                        }}
                    />
                    <button type="submit" aria-label="Adicionar novo item">
                        +
                    </button>
                </form>
            </header>

            <section>
                <form>
                    <input
                        type="text"
                        placeholder="Filtrar lista atual, ex: Dentista"
                        value={search}
                        onChange={function handleSearch(event) {
                            setSearch(event.target.value)
                        }}
                    />
                </form>

                <table border={1}>
                    <thead>
                        <tr>
                            <th align="left">
                                <input type="checkbox" disabled />
                            </th>
                            <th align="left">Id</th>
                            <th align="left">Conteúdo</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {homeTodos.map((todo) => {
                            return (
                                <tr key={todo.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={function handleToggle() {
                                                todoController.toggleDone({
                                                    id: todo.id,
                                                    updateTodoOnScreen: () => {
                                                        setTodos((t) => {
                                                            return t.map(
                                                                (current) => {
                                                                    if (
                                                                        current.id ===
                                                                        todo.id
                                                                    ) {
                                                                        return {
                                                                            ...current,
                                                                            done: !current.done,
                                                                        }
                                                                    }
                                                                    return current
                                                                },
                                                            )
                                                        })
                                                    },
                                                    onError() {
                                                        alert(
                                                            'Failed to update',
                                                        )
                                                    },
                                                })
                                            }}
                                            checked={todo.done}
                                        />
                                    </td>
                                    <td>{todo.id.substring(0, 4)}</td>
                                    <td>
                                        {!todo.done && todo.content}
                                        {todo.done && <s>{todo.content}</s>}
                                    </td>
                                    <td align="right">
                                        <button
                                            data-type="delete"
                                            onClick={function handleDelete() {
                                                todoController
                                                    .deleteById(todo.id)
                                                    .then(() => {
                                                        setTodos((t) => {
                                                            return t.filter(
                                                                (current) => {
                                                                    return (
                                                                        current.id !==
                                                                        todo.id
                                                                    )
                                                                },
                                                            )
                                                        })
                                                    })
                                                    .catch(() =>
                                                        // eslint-disable-next-line no-console
                                                        console.error(
                                                            'Failed to delete',
                                                        ),
                                                    )
                                            }}
                                        >
                                            Apagar
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}

                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: 'center' }}
                                >
                                    Carregando...
                                </td>
                            </tr>
                        )}
                        {hasNoTodos && (
                            <tr>
                                <td colSpan={4} align="center">
                                    Nenhum item encontrado
                                </td>
                            </tr>
                        )}

                        {hasMorePages && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: 'center' }}
                                >
                                    <button
                                        data-type="load-more"
                                        onClick={() => {
                                            const nextPage = page + 1
                                            setPage(nextPage)

                                            todoController
                                                .get({ page: nextPage })
                                                .then(({ todos, pages }) => {
                                                    setTodos((t) => [
                                                        ...t,
                                                        ...todos,
                                                    ])
                                                    setTotalPages(pages)
                                                })
                                        }}
                                    >
                                        Página {page}, Carregar mais{' '}
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                marginLeft: '4px',
                                                fontSize: '1.2em',
                                            }}
                                        >
                                            ↓
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </main>
    )
}

export default Home
