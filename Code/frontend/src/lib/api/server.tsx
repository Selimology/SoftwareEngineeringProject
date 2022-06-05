interface Body {
  query: string
}

export const server = {
  fetch: async (body: Body) => {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    //response object is JSON by
    return response.json()
  },
}
