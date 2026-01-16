import { Router } from "express";

const router = Router();

router.post('/auth/register', (req, res) => {
    console.log(req.body);
    console.log('Registro de usuario')
})

router.get('/', (req, res) => {
    res.send('Hola Mundo / TS')
})

router.get('/nosotros', (req, res) => {
    res.send('Página de Nosotros')
})

router.get('/blog', (req, res) => {
    res.send('Página de Blog')
})

export default router;