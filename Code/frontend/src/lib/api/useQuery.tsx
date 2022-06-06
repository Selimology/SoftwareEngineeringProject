import React, { useState, useEffect } from "react"
import { server } from "./server"
interface State<TypeData> {
  data: TypeData | null
}
export const useQuery = <TypeData = any,>(query: string) => {
  const [state, setState] = useState<State<TypeData>>({ data: null })

  useEffect(() => {
    const apiFetch = async () => {
      const { data } = await server.fetch<TypeData>({ query })
      setState({ data })
    }
    apiFetch()
  }, [query])
  return state
}
