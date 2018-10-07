const mongoose = require('mongoose')
const validator = require('validator')

const jwt = require('jsonwebtoken')
const _ = require('lodash')
//const {Subject} = require('./models/subject');
const config = require('..//config/const')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
    email: {
        require: true,
        type: String,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: `Email is not a valid email`
        }
    },
    password: {
        required: true,
        type: String,
        minlength: 6
    },
    username: {
        required: true,
        type: String,
        trim: true,
        unique: true
    },
    average: {
        type: Number,
        default: 1
    },
    subjects:{
        default:[],
        type: [{
        subject: {
            type: String
        },
        labGrade: {
            required: true,
            type: Number,
            default: 1

        },
        examGrade: {
            required: true,
            type: Number,
            default: 1
        }
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 12']
        
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})
function arrayLimit(val) {
    return val.length <= 12;
  }
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email','subjects','average']);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access: access},config.RANDOM_STRING).toString()

    user.tokens.unshift({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    }).catch(e=>console.log(e));
};
UserSchema.statics.findByToken = function(token){
    var User = this
    var decoded

    try {
        decoded = jwt.verify(token,config.RANDOM_STRING)
    } catch (err) {
        return Promise.reject(err)
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}
UserSchema.statics.findByCredentials = function(email,password){
    var User = this


    return User.findOne({email}).then((user) =>{
        if(!user){
            return Promise.reject()
        }
        return new Promise((resolve,reject) =>{
            console.log(password+'      '+user.password)
           bcrypt.compare(password,user.password,(err, res) =>{
               if(res){
                   resolve(user)
               } else {
                   reject(err)
               }
           })
        })

    }).catch((e)=>{
        res.status(400).send()
    })
}
UserSchema.methods.removeToken = function(token){
    var user = this 
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    })
}
//salvarea parolei hashed
UserSchema.pre('save', function(next){
    var user = this
    console.log(1)

    if(user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt){
            if(err){
                console.log(err)
                return
            }
            user.password = bcrypt.hashSync(user.password, salt)
            next()
        })
    } else {
        next()
    }
})

var User = mongoose.model('Users',UserSchema);

module.exports = {
    User: User
}