import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import rutasServicio from './api-crud/modulos/servicios/rutas.servicio.mjs'
import rutasApi from './api/v1/rutas.api.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const puerto = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api-crud/servicios', rutasServicio)
app.use('/api/v1/servicios', rutasApi)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'vistas/web')))
app.use('/admin', express.static(path.join(__dirname, 'vistas/crud')))

app.get('/',      (req, res) => res.sendFile(path.join(__dirname, 'vistas/web/index.html')))
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'vistas/crud/index.html')))

app.listen(puerto, () => console.log(`http://localhost:${puerto}`))
