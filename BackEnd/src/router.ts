import { Router } from "express";
import {body} from "express-validator";
import { createAccount, getUser, login } from "./handlers";
import { handleInputErrors } from "./middleware/validation";

const router = Router();

router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacío'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacío'),
    body('email')
        .isEmail()
        .withMessage('Email no válido'),    
    body('password')
        .isLength({min: 8})
        .withMessage('La contraseña es muy corta, mínimo son 8 caracteres'),
    handleInputErrors,
    createAccount)

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email no válido'),    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    login
)

router.get('/user', getUser)

export default router;