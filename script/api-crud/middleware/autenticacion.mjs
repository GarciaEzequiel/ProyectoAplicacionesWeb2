import jwt from 'jsonwebtoken'

export function verificarToken(req, res, next) {
  const token = req.signedCookies?.token
  if (!token) return res.status(401).json({ error: 'No autorizado' })
  try {
    req.usuario = jwt.verify(token, process.env.CLAVE_JWT)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
