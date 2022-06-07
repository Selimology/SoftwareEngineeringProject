import { useReducer } from "react"
import { server } from "./server"

type Action<TypeData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TypeData }
  | { type: "FETCH_ERROR" }

//https: www.w3schools.com/typescript/typescript_tuples.php
type MutationTuple<TypeData, TypeVariables> = [
  (variables?: TypeVariables | undefined) => Promise<void>,
  State<TypeData>
]

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
interface State<TypeData> {
  data: TypeData | null
  loading: boolean
  error: boolean
}

export const useMutation = <TypeData = any, TypeVariables = any>(
  query: string
): MutationTuple<TypeData, TypeVariables> => {
  const fetchReducer = reducer<TypeData>()
  const [state, dispatch] = useReducer(fetchReducer, {
    //inital state
    data: null,
    loading: false,
    error: false,
  })

  /* 
  We aren't using useEffect here because we want to be in control of when the
  fetch function is called. We want to be able to call it manually.
  */
  const fetch = async (variables?: TypeVariables) => {
    try {
      dispatch({ type: "FETCH" })
      const { data, errors } = await server.fetch<TypeData, TypeVariables>({
        query,
        variables,
      })

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message)
      }

      dispatch({ type: "FETCH_SUCCESS", payload: data })
    } catch (error) {
      dispatch({ type: "FETCH_ERROR" })

      throw console.error(error)
    }
  }

  /* 
  Destructure it as an array instead of object
  We can name the request function as we like.
  
  We use tuple, since fetch returns Promise<Void>
  State is type of state.
  */
  return [fetch, state]
}
