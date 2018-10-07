var mongoose = require('mongoose');
const config = require('../config/const')
var Subject = mongoose.model('Subjects',{
    name:{
        type: String,
        required: true,
        minlength: 1

    },
    code: {
        type: String,
        required: true,
        minlength: 1,
        unique: true
    },
    credits:{
        type: Number,
        required: true,
        default: 5
    },
    teacher: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        minlength: 3
    }
    // labGrade:{
    //     type: Number,
    //     required: true
    //     //default: 0
    // },
    // examGrade:{
    //     type: Number,
    //     required: true
    //     //default: 0
    // }
   
})

module.exports = {
    Subject: Subject
}