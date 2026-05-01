import express from 'express'

const puerto = 3000

const app = express()


app.use(express.static('front'))

app.listen(puerto, () => {
    console.log(`http://localhost:${puerto}`)
})