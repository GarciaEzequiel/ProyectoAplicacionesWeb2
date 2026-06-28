import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { obtenerPorUsuario, crear } from './modelo.usuario.mjs'

export async function registro(req, res) {
  try {
    const { usuario, clave } = req.body
    if (!usuario || !clave) return res.status(400).json({ error: 'Usuario y clave son requeridos' })

    const existente = await obtenerPorUsuario(usuario)
    if (existente) return res.status(409).json({ error: 'El usuario ya existe' })

    const claveHash = await bcrypt.hash(clave, 10)
    const nuevo = await crear(usuario, claveHash)

    const token = jwt.sign(
      { id: nuevo.id, usuario: nuevo.usuario },
      process.env.CLAVE_JWT,
      { expiresIn: '8h' }
    )
    res.cookie('token', token, { httpOnly: true, signed: true })
    res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevo.usuario })
  } catch {
    res.status(500).json({ error: 'Error al registrar el usuario' })
  }
}

export async function login(req, res) {
  try {
    const { usuario, clave } = req.body
    if (!usuario || !clave) return res.status(400).json({ error: 'Usuario y clave son requeridos' })

    const user = await obtenerPorUsuario(usuario)
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

    const coincide = await bcrypt.compare(clave, user.clave)
    if (!coincide) return res.status(401).json({ error: 'Credenciales inválidas' })

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      process.env.CLAVE_JWT,
      { expiresIn: '8h' }
    )
    res.cookie('token', token, { httpOnly: true, signed: true })
    res.json({ mensaje: 'Login exitoso', usuario: user.usuario })
  } catch {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

export function logout(req, res) {
  res.clearCookie('token')
  res.json({ mensaje: 'Sesión cerrada' })
}

export function verificar(req, res) {
  res.json({ usuario: req.usuario.usuario })
}
