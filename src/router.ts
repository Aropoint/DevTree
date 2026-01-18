import { Router } from "express";
import { createAccount } from "./handlers";

const router = Router();

router.post('/auth/register', createAccount)

router.get('/', (req, res) => {
    res.send('Hola Mundo / TS')
})

export default router;