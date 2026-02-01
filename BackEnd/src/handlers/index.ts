import { Request, Response } from "express"
import slug from "slug"
import User from "../models/User"
import { hashPassword, checkPassword } from "../utils/auth"
import { validationResult } from "express-validator"
import { generateJWT } from "../utils/jwt"
import jwt from "jsonwebtoken"

export const createAccount = async (req: Request, res: Response) => {
    
    const { email , password} = req.body
    const userExist = await User.findOne({email})

    if(userExist) {
        const error = new Error('Un usuario con ese email ya está registrado')
        return res.status(409).json({error: error.message})
    }
    
    const handle = slug(req.body.handle, '')
    const handleExist = await User.findOne({handle})

    if(handleExist) {
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({error: error.message})
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle 

    await user.save()
    
    res.status(201).json({msg: 'Usuario registrado correctamente'})
}

export const login = async (req: Request, res: Response) => {
    let errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
    
    // Revisar si el usuario está registrado
    const { email , password} = req.body
    const user = await User.findOne({email})

    if(!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({error: error.message})
    }

    // Comprobación del password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if(!isPasswordCorrect) {
        const error = new Error('El password es incorrecto')
        return res.status(401).json({error: error.message})
    }

    const token = generateJWT({id: user._id})

    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    const bearer = req.headers.authorization

    if(!bearer) {
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }

    const [, token ] = bearer.split(' ')

    if(!token) {
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof result === 'object' && result.id){
            const user = await User.findById(result.id).select('-password')
            if(!user) {
                const error = new Error('El Usuario no existe')
                return res.status(404).json({error: error.message})
            }
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json({error: "Token no Válido" })
    }
}