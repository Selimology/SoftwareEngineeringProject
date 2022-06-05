interface Body<TypeVariable> {
  query: string
  variables?: TypeVariable
}

export const server = {
  fetch: async <TypeData = any, TypeVariable = any>(
    body: Body<TypeVariable>
  ) => {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    //response object is JSON by
    return response.json() as Promise<{ data: TypeData }>
  },
}
