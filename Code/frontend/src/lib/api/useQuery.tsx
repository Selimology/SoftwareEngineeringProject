import React, { useState, useEffect, useCallback } from "react"
import { server } from "./server"
interface State<TypeData> {
  data: TypeData | null
}
export const useQuery = <TypeData = any,>(query: string) => {
  const [state, setState] = useState<State<TypeData>>({ data: null })

  //never run and change unless query changes
  const fetch = useCallback(() => {
    const apiFetch = async () => {
      const { data } = await server.fetch<TypeData>({ query })
      setState({ data })
    }
    apiFetch()
  }, [query])

  // fetch on mount first time
  useEffect(() => {
    fetch()
  }, [fetch])

  return { ...state, refetch: fetch }
}
