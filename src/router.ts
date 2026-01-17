import { Router } from "express";
import User from "./models/User";

const router = Router();

router.post('/auth/register', async (req, res) => {
    const user = new User(req.body)
    await user.save()
})

router.get('/', (req, res) => {
    res.send('Hola Mundo / TS')
})

export default router;