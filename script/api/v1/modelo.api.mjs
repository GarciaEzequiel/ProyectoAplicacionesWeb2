import pool from '../../api-crud/configuraciones/baseDeDatos.mjs'

export async function obtenerTodos() {
  try {
    const { rows } = await pool.query('SELECT * FROM servicios')
    return rows
  } catch (error) {
    throw error
  }
}

export async function obtenerPorId(id) {
  try {
    const { rows } = await pool.query('SELECT * FROM servicios WHERE id = $1', [id])
    return rows[0]
  } catch (error) {
    throw error
  }
}
