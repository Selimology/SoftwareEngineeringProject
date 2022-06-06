interface Body<TypeVariable> {
  query: string
  variables?: TypeVariable
}

interface Error {
  message: string
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

    //if server response that is not successful
    if (!response.ok) {
      const { message } = await response.json()
      throw new Error(message)
    }
    //response object is JSON by
    return response.json() as Promise<{
      data: TypeData
      //if server response is successful but graphql api returns error
      errors: Error[]
    }>
  },
}
