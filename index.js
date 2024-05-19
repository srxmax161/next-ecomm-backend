import express from "express"
import prisma from "./src/utils/prisma.js"
import { Prisma } from "@prisma/client"

const app = express()
const port = process.env.PORT || 8080


app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})

app.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany()
  res.json(allUsers)
})

app.post('/users', async (req, res) => {
  const data = req.body


  prisma.user.create({
    data
  }).then(user => {
    return res.json(user)

  }).catch(err => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const formattedError = {}
      formattedError[`${err.meta.target[0]}`] = 'already taken'

      return res.status(500).send({
        error: formattedError
      });  // friendly error handling
    }
    throw err  // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
  })
})