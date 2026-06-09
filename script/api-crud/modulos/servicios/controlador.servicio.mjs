import { obtenerTodos, obtenerPorId, crear, modificar, eliminar } from './modelo.servicio.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGENES = path.join(__dirname, '../../../public/imagenes')

export async function getAll(req, res) {
  try {
    const servicios = await obtenerTodos()
    res.json(servicios)
  } catch {
    res.status(500).json({ error: 'Error al obtener servicios' })
  }
}

export async function getOne(req, res) {
  try {
    const servicio = await obtenerPorId(req.params.id)
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' })
    res.json(servicio)
  } catch {
    res.status(500).json({ error: 'Error al obtener el servicio' })
  }
}

export async function post(req, res) {
  try {
    const { nombre, descripcion } = req.body
    const imagen = req.file?.filename ?? null
    const servicio = await crear(nombre, descripcion, imagen)
    res.status(201).json(servicio)
  } catch {
    res.status(500).json({ error: 'Error al crear el servicio' })
  }
}

export async function put(req, res) {
  try {
    const actual = await obtenerPorId(req.params.id)
    if (!actual) return res.status(404).json({ error: 'Servicio no encontrado' })

    const { nombre, descripcion } = req.body
    let imagen = actual.imagen

    if (req.file) {
      if (actual.imagen) fs.unlink(path.join(IMAGENES, actual.imagen), () => {})
      imagen = req.file.filename
    }

    const servicio = await modificar(req.params.id, nombre, descripcion, imagen)
    res.json(servicio)
  } catch {
    res.status(500).json({ error: 'Error al modificar el servicio' })
  }
}

export async function remove(req, res) {
  try {
    const servicio = await eliminar(req.params.id)
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' })
    if (servicio.imagen) fs.unlink(path.join(IMAGENES, servicio.imagen), () => {})
    res.json(servicio)
  } catch {
    res.status(500).json({ error: 'Error al eliminar el servicio' })
  }
}
