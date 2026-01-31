import mongoose, {Schema} from "mongoose";

export interface IUser {
    handle: string
    name: string
    email: string
    password: string
}

const userSchema = new Schema({
    handle: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
})

const User = mongoose.model<IUser>('User', userSchema)
export default User