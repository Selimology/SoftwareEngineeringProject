import { IResolvers } from "@graphql-tools/utils"

export const usingUserResolver: IResolvers = {
  Query: {
    authUrl: () => {
      return "Query.authUrl"
    },
  },
  Mutation: {
    logIn: () => {
      return "Mutation.logIn"
    },
    logOut: () => {
      return "Mutation.LogOut"
    },
  },
}
