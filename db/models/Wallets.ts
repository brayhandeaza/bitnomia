import mongoose, { Schema } from 'mongoose'

const WalletsSchema = new Schema({
    privateKey: {
        type: String,
        required: true,
        unique: true
    },
    publicKey: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

export = mongoose.model('Wallets', WalletsSchema)