const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')

const app = express()

// app.use((req, res, next) => {
//     res.status(503).send('We are on maintenance!')
// })

app.use(express.json())
app.use(userRouter)
app.use(postRouter)

module.exports = app