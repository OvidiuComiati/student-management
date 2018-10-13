//const {User} = require('../models/user')
const {User} = require('../models/user')
const {Average} = require('../models/average')

getScores = () => {
    //intra aici
    User.find({}).then(users => {
        //intra aici
        users.forEach( user =>{
            //console.log('in');
            
            var average = new Average({
                username: user.username,
                average: user.average
            })
            console.log(average);
            average.save().then((doc) => {
                
                return res.send(doc);
            }).catch((err) => {
                res.status(400).send(err);
            })
            
        } )
    }).catch( (err) => {
        console.log('not ok');
    })
}

module.exports = {
    getScores
}