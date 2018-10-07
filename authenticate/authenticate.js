const {User} = require('../models/user')

var autenthicate = (req, res, next) => {
    var token = req.header('x-auth')

    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject() 
        }

       req.user = user
       req.token = token

       next()
    },() => {
        res.status(401).send()    
    })
}

module.exports = autenthicate

