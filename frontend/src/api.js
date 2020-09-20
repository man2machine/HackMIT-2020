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

// mocks for now

export const mock_data = [
        {
          name: "Page A",
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: "Page B",
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: "Page C",
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
      ]

export const mock_data_bar = [
        {
          name: "Page A",
          uv: 4000,
          pv: 2400,
        },
        {
          name: "Page B",
          uv: 3000,
          pv: 1398,
        },
        {
          name: "Page C",
          uv: 2000,
          pv: 9800,
        },
        {
          name: "Page D",
          uv: 2780,
          pv: 3908,
        }
      ]