// boiler plate for get and post requests to our rest api

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
    location:
      "Stratton Student Center, 84 Massachusetts Ave, Cambridge, MA 02139",
  },
  {
    name: "Annas",
    location:
      "Stratton Student Center, 84 Massachusetts Ave, Cambridge, MA 02139",
  },
  {
    name: "Beantown",
    location: "245 Massachusetts Ave, Cambridge, MA 02139",
  },
  {
    name: "Thelonius Monkfish",
    location: "Cambridge",
  },
  {
    name: "Happy Lamb Hot Pot",
    location: "Cambridge",
  },
  {
    name: "Bertuccis",
    location: "Cambridge",
  },
  {
    name: "McD",
    location: "everywhere",
  },
  {
    name: "other places",
    location: "everywhere",
  },
  {
    name: "boston exists",
    location: "everywhere",
  },
  {
    name: "harvard is a meme",
    location: "everywhere",
  },
  {
    name: "yee",
    location: "everywhere",
  },
  {
    name: "yaw",
    location: "everywhere",
  },
  {
    name: "Verdes1",
    location: "everywhere",
  },
  {
    name: "Annas1",
    location: "everywhere",
  },
  {
    name: "Beanto1wn",
    location: "everywhere",
  },
  {
    name: "Theloni2us Monkfish",
    location: "everywhere",
  },
  {
    name: "Happy La3mb Hot Pot",
    location: "everywhere",
  },
  {
    name: "Bertuccis4",
    location: "everywhere",
  },
  {
    name: "Mc2D",
    location: "everywhere",
  },
  {
    name: "othe3r places",
    location: "everywhere",
  },
  {
    name: "bosto7n exists",
    location: "everywhere",
  },
  {
    name: "har4vard is a meme",
    location: "everywhere",
  },
  {
    name: "ye2e",
    location: "everywhere",
  },
  {
    name: "ya1w",
    location: "everywhere",
  },
];

export const mock_list_cols = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Location',
    key: 'location'
  }
]

export const mock_cards = {
  pasta: 31,
  pizza: 22,
};