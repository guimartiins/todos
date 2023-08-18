async function get() {
    return fetch('api/todos').then(async (response) => {
        return response.json()
    })
}

export const todoController = {
    get,
}
