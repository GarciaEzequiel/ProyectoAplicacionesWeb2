import { Router } from 'express'
import { registro, login, logout, verificar } from './controlador.usuario.mjs'
import { verificarToken } from '../../middleware/autenticacion.mjs'

const router = Router()

router.post('/registro', registro)
router.post('/login', login)
router.post('/logout', logout)
router.get('/verificar', verificarToken, verificar)

export default router
