import Express from 'express'

const app = new Express()

app.use((req, res, next) => {
  console.log(`${req.method} request at ${req.path}`)
  next()
})

app.use(Express.static('./public'))

app.listen(3000)
console.log('Listening on port 3000')
