import pool from '../../configuraciones/baseDeDatos.mjs'

export async function obtenerPorUsuario(usuario) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1',
      [usuario]
    )
    return rows[0]
  } catch (error) {
    throw error
  }
}

export async function crear(usuario, claveHash) {
  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (usuario, clave) VALUES ($1, $2) RETURNING id, usuario',
      [usuario, claveHash]
    )
    return rows[0]
  } catch (error) {
    throw error
  }
}
