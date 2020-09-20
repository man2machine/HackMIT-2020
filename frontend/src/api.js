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

export const mock_data_list = [
  {
    name: "Verdes",
  },
  {
    name: "Annas",
  },
  {
    name: "Beantown",
  },
  {
    name: "Thelonius Monkfish",
  },
  {
    name: "Happy Lamb Hot Pot",
  },
  {
    name: "Bertuccis",
  },
  {
    name: "McD",
  },
  {
    name: "other places",
  },
  {
    name: "boston exists",
  },
  {
    name: "harvard is a meme",
  },
  {
    name: "yee",
  },
  {
    name: "yaw",
  },
  {
    name: "Verdes1",
  },
  {
    name: "Annas1",
  },
  {
    name: "Beanto1wn",
  },
  {
    name: "Theloni2us Monkfish",
  },
  {
    name: "Happy La3mb Hot Pot",
  },
  {
    name: "Bertuccis4",
  },
  {
    name: "Mc2D",
  },
  {
    name: "othe3r places",
  },
  {
    name: "bosto7n exists",
  },
  {
    name: "har4vard is a meme",
  },
  {
    name: "ye2e",
  },
  {
    name: "ya1w",
  },
];

export const mock_list_cols = [
  {
    title: 'Name',
    key: 'name',
  },
]

export const mock_cards = {
  pasta: 31,
  pizza: 22,
};