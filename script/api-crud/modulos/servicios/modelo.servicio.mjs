import pool from '../../configuraciones/baseDeDatos.mjs'

export async function obtenerTodos() {
  const { rows } = await pool.query('SELECT * FROM servicios')
  return rows
}

export async function obtenerPorId(id) {
  const { rows } = await pool.query('SELECT * FROM servicios WHERE id = $1', [id])
  return rows[0]
}

export async function crear(nombre, descripcion, imagen) {
  const { rows } = await pool.query(
    'INSERT INTO servicios (nombre, descripcion, imagen) VALUES ($1, $2, $3) RETURNING *',
    [nombre, descripcion, imagen]
  )
  return rows[0]
}

export async function modificar(id, nombre, descripcion, imagen) {
  const { rows } = await pool.query(
    'UPDATE servicios SET nombre = $2, descripcion = $3, imagen = $4 WHERE id = $1 RETURNING *',
    [id, nombre, descripcion, imagen]
  )
  return rows[0]
}

export async function eliminar(id) {
  const { rows } = await pool.query(
    'DELETE FROM servicios WHERE id = $1 RETURNING *',
    [id]
  )
  return rows[0]
}
