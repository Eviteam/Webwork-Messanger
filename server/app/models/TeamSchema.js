const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const team = new Schema({
    team_name: {
        type: String,
        required: true
    },
    team_id: {
        type: Number,
        required: true
    },
    users:  {
        type: Array
    },
    // team: {
    //     type: Array
    // },
    user_id: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Team', team)