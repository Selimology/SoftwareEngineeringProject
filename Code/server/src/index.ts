import "dotenv/config"
import express, { Application } from "express"
import { ApolloServer } from "apollo-server-express"

const app = express()

const server = new ApolloServer({ typeDefs, resolvers })

server.start().then((res) => {
  server.applyMiddleware({ app, path: "/api" })
})

app.listen(process.env.PORT)

console.log(`Server started on port ${process.env.PORT}`)
