import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import path from 'path'
import rutasServicio from './api-crud/modulos/servicios/rutas.servicio.mjs'
import rutasApi from './api/v1/rutas.api.mjs'
import rutasAuth from './api-crud/modulos/usuarios/rutas.usuario.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const puerto = process.env.PUERTO ?? 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS: frontend y API comparten el mismo origen (localhost:PUERTO), no hay peticiones
// cross-origin en este proyecto. No se necesita el middleware cors.
app.use(cookieParser(process.env.FIRMA_COOKIE))

app.use('/api-crud/auth',     rutasAuth)
app.use('/api-crud/servicios', rutasServicio)
app.use('/api/v1/servicios',  rutasApi)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'vistas/web')))
app.use('/admin', express.static(path.join(__dirname, 'vistas/crud')))

app.get('/',      (req, res) => res.sendFile(path.join(__dirname, 'vistas/web/index.html')))
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'vistas/crud/index.html')))

app.listen(puerto, () => console.log(`http://localhost:${puerto}`))
