const mongoose = require('mongoose')

var averageSchema = new mongoose.Schema({
    average: {
        type: Number,
        required: true,
    },
    username: {
        type: String, 
        required: true
    }
})

var average = mongoose.model('Average',averageSchema);


module.exports = {
    average: average
}