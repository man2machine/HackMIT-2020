export async function api_post(endpoint, body) {
    const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    })
    const json = await response.json()
    return { json, response }
}

export async function api_get(endpoint) {
    const response = await fetch(endpoint, {
        method: 'GET'
    })
    const json = await response.json()
    return { json, response }
}