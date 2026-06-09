import { Router } from 'express'
import { getAll, getOne } from './controlador.api.mjs'

const router = Router()

router.get('/', getAll)
router.get('/:id', getOne)

export default router
