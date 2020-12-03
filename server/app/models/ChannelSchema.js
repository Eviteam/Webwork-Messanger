const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    channelName: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    message: {
        type: String
    },
    isGlobal: {
        type: Boolean
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Channel', channelSchema)