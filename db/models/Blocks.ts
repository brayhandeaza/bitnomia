import mongoose, { Schema } from 'mongoose'

const BlocksSchema = new Schema({
    timestamp: {
        type: Number,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    lastHash: {
        type: String,
        required: true
    },
    transactions: {
        type: Array,
        required: true
    },
    signature: {
        type: String,
        required: true
    }
})

export = mongoose.model('Blocks', BlocksSchema)