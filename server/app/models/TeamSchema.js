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
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Team', team)