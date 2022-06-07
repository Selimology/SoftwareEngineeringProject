import { useEffect, useReducer, useCallback } from "react"
import { server } from "./server"

type Action<TypeData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TypeData }
  | { type: "FETCH_ERROR" }

interface QueryResult<TypeData> extends State<TypeData> {
  refetch: () => void
}
interface State<TypeData> {
  data: TypeData | null
  loading: boolean
  error: boolean
}

const reducer =
  <TypeData,>() =>
  (state: State<TypeData>, action: Action<TypeData>): State<TypeData> => {
    switch (action.type) {
      case "FETCH":
        return {
          ...state,
          loading: true,
        }
      case "FETCH_SUCCESS":
        return {
          data: action.payload,
          error: false,
          loading: false,
        }

      case "FETCH_ERROR":
        return {
          ...state,
          error: true,
          loading: false,
        }
      default:
        throw new Error()
    }
  }
export const useQuery = <TypeData = any,>(
  query: string
): QueryResult<TypeData> => {
  const fetchReducer = reducer<TypeData>()
  const [state, dispatch] = useReducer(fetchReducer, {
    //inital state
    data: null,
    loading: false,
    error: false,
  })

  //never run and change unless query changes
  const fetch = useCallback(() => {
    const apiFetch = async () => {
      try {
        dispatch({ type: "FETCH" })
        /* If server fetch function is succesful, but graphql
        returns an error we deconstrcuts errors and 
        check for the condition  */
        const { data, errors } = await server.fetch<TypeData>({ query })

        //this message will be caught and displayed in the console
        if (errors && errors.length > 0) {
          throw new Error(errors[0].message)
        }

        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (error) {
        //if error occurs print the error and keep loading
        dispatch({ type: "FETCH_ERROR" })
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
