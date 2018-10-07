const mongoose = require('mongoose')

const average = mongoose.model({
    score: {
        type: Number,
        required: true,
    },
    username: {
        type: String, 
        required: true
    }
})



module.exports = {
    average: average
}