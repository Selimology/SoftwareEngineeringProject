import { useState } from "react"
import { server } from "./server"

//https: www.w3schools.com/typescript/typescript_tuples.php
type MutationTuple<TypeData, TypeVariables> = [
  (variables?: TypeVariables | undefined) => Promise<void>,
  State<TypeData>
]

interface State<TypeData> {
  data: TypeData | null
  loading: boolean
  error: boolean
}

export const useMutation = <TypeData = any, TypeVariables = any>(
  query: string
): MutationTuple<TypeData, TypeVariables> => {
  const [state, setState] = useState<State<TypeData>>({
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
      setState({
        data: null,
        loading: true,
        error: false,
      })
      const { data, errors } = await server.fetch<TypeData, TypeVariables>({
        query,
        variables,
      })
      setState({
        data,
        loading: false,
        error: false,
      })

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message)
      }

      setState({ data, loading: false, error: false })
    } catch (error) {
      setState({ data: null, loading: false, error: true })

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
