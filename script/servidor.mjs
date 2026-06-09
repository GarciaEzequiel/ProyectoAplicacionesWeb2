// Punto de entrada del servidor Express: registra middlewares, rutas y levanta el servidor
import express from 'express'

const puerto = 3000

const app = express()

app.use(express.static('vistas/web'))

app.listen(puerto, () => {
    console.log(`http://localhost:${puerto}`)
})
