import app from "./app.js"
import prisma from "./src/utils/prisma.js"

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})

app.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany()
  res.json(allUsers)
})