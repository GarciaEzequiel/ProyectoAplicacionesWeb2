import { obtenerTodos, obtenerPorId } from './modelo.api.mjs'

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
