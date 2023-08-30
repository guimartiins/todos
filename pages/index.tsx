import React from 'react'
import { GlobalStyles } from '@ui/theme/GlobalStyles'
import { useState } from 'react'
import { useEffect } from 'react'
import { todoController } from '../src/ui/controller/todo'

type UUID = string

type HomeTodo = {
    id: UUID
    content: string
}

function Home() {
    const [initialLoadComplete, setInitialLoadComplete] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [todos, setTodos] = useState<HomeTodo[]>([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const hasNoTodos = todos.length === 0 && !isLoading

    const hasMorePages = page < totalPages
    useEffect(() => {
        setInitialLoadComplete(true)
        if (!initialLoadComplete) {
            todoController
                .get({ page })
                .then(({ todos, pages }) => {
                    setTodos(todos)
                    setTotalPages(pages)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [])

    return (
        <main>
            <GlobalStyles />
            <header
                style={
                    {
                        //  backgroundImage: `url('${bg}')`,
                    }
                }
            >
                <div className="typewriter">
                    <h1>O que fazer hoje?</h1>
                </div>
                <form>
                    <input type="text" placeholder="Correr, Estudar..." />
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
                        {todos.map((todo) => {
                            return (
                                <tr key={todo.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{todo.id.substring(0, 4)}</td>
                                    <td>{todo.content}</td>
                                    <td align="right">
                                        <button data-type="delete">
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
