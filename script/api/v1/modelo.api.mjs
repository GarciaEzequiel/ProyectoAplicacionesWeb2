import pool from '../../api-crud/configuraciones/baseDeDatos.mjs'

export async function obtenerTodos() {
  const { rows } = await pool.query('SELECT * FROM servicios')
  return rows
}

export async function obtenerPorId(id) {
  const { rows } = await pool.query('SELECT * FROM servicios WHERE id = $1', [id])
  return rows[0]
}
