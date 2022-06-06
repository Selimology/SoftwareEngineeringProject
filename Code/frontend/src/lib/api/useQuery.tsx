import React, { useState, useEffect, useCallback } from "react"
import { server } from "./server"
interface State<TypeData> {
  data: TypeData | null
  loading: boolean
  error: boolean
}
export const useQuery = <TypeData = any,>(query: string) => {
  const [state, setState] = useState<State<TypeData>>({
    data: null,
    loading: false,
    error: false,
  })

  //never run and change unless query changes
  const fetch = useCallback(() => {
    const apiFetch = async () => {
      try {
        setState({ data: null, loading: true, error: false })
        /* If server fetch function is succesful, but graphql
        returns an error we deconstrcuts errors and 
        check for the condition  */
        const { data, errors } = await server.fetch<TypeData>({ query })

        //this message will be caught and displayed in the console
        if (errors && errors.length > 0) {
          throw new Error(errors[0].message)
        }

        setState({ data, loading: false, error: false })
      } catch (error) {
        //if error occurs print the error and keep loading
        setState({ data: null, loading: false, error: true })
        //using console.error since we don't know the type of error
        throw console.error(error)
      }
    }
    apiFetch()
  }, [query])

  // fetch on mount first time
  useEffect(() => {
    fetch()
  }, [fetch])

  return { ...state, refetch: fetch }
}
