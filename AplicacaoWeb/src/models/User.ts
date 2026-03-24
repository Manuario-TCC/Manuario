import mongoose, { Schema, Document, models } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    publicId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'O nome é obrigatório'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'O e-mail é obrigatório'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: [true, 'A senha é obrigatória'],
        },
        publicId: {
            type: String,
            unique: true,
            default: () => crypto.randomBytes(6).toString('hex'), 
        }
    },
    {
        timestamps: true, 
    }
);

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;