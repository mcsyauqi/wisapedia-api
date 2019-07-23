const app = require('./app')

const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(503).send('We are on maintenance!')
// })

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})