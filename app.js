import express from "express"
import loginrouter from "./src/controllers/login.controllers.js"
import cors from "cors"
import signuprouter from "./src/controllers/sign-up.controllers.js"
import prisma from "./src/utils/prisma.js"
import morgan from "morgan"
import auth from "./src/middlewares/auth.js"
import uploadrouter from "./src/controllers/upload.controller.js"
import authRefreshController from "./src/controllers/auth-refresh.controller.js"
import checkoutrouter from "./src/controllers/checkout.controller.js"

const app = express()
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.use("/users", signuprouter)
app.use("/auth", loginrouter)
app.use("/upload", uploadrouter)
app.use("/auth-refresh", authRefreshController)
app.use("/checkout", checkoutrouter)

app.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany()
  res.json(allUsers)
})

app.delete(`/delete/:id`, async (req, res) => {
    const { id } = req.body
    const post = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    })
    res.json(post)
})



app.get('/protected', auth, (req, res) => {
    res.json({ "hello": "world" })
})

export default app