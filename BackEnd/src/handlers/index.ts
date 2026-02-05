import { Request, Response } from "express"
import slug from "slug"
import User from "../models/User"
import { hashPassword, checkPassword } from "../utils/auth"
import { validationResult } from "express-validator"
import formidable from "formidable"
import {v4 as uuid} from "uuid"
import { generateJWT } from "../utils/jwt"
import cloudinary from "../config/cloudinary"

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
    res.status(200).json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description , links} = req.body
        const handle = slug(req.body.handle, '')
        const handleExist = await User.findOne({handle})

        if(handleExist && handleExist.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible')
            return res.status(409).json({error: error.message})
        }

        // Actualizar el usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        
        res.status(200).json("Perfil actualizado correctamente")
    } catch (e) {
        const error = new Error('Error al actualizar el perfil')
        return res.status(500).json({error: error.message})
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({multiples: false})

    try {
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, {public_id: uuid()}, async function(error, result) {
                if(error) {
                    const err = new Error('Error al subir la imagen')
                    return res.status(500).json({error: err.message})
                }
                if(result) {
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.status(200).json({image: result.secure_url})
                }

            })
        })
    } catch (e) {
        const error = new Error('Error al actualizar el perfil')
        return res.status(500).json({error: error.message})
    }
}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const {handle} = req.params
        const user = await User.findOne({handle}).select('-_id -__v -password -email')

        if(!user){
            const error = new Error("El Usuario no existe")
            return res.status(404).json({error: error.message})
        }

        res.json(user)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(404).json({error: error.message})
    }
}