import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAll, getOne, post, put, remove } from './controlador.servicio.mjs'
import { verificarToken } from '../../middleware/autenticacion.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGENES = path.join(__dirname, '../../../public/imagenes')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGENES),
  filename:    (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
})

const upload = multer({ storage })
const router = Router()

router.get('/',       getAll)
router.get('/:id',    getOne)
router.post('/',      verificarToken, upload.single('imagen'), post)
router.put('/:id',   verificarToken, upload.single('imagen'), put)
router.delete('/:id', verificarToken, remove)

export default router
