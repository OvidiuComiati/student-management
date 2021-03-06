const _=require('lodash');
const express = require('express')
    ,router = express.Router()
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


const authenticate = require('../authenticate/authenticate');
const {mongoose} = require('../db/mongoose');
const {Subject} = require('../models/subject');
const {User} = require('../models/user');


const app = express()

app.use(bodyParser.json({useNewUrlParser:true}))
const port = process.env.PORT || 3000;

router.post('/subjects',(req,res) => {
    var body = _.pick(req.body,['name','code','teacher','description']);
    var subject = new Subject(body);
    console.log(subject);
    subject.save().then((doc) => {
       
        return res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    })
})
//sign up
router.post('/Users',(req,res) => {
    console.log(2)
    var body = _.pick(req.body,['email','username','password']);
    var user = new User(body);
    console.log(user);
    user.save().then(() => {
        console.log(2)
        //res.send(doc);
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch( (err) => {
        res.status(400).send(err);
    })
});

//login
router.post('/login', (req, res) =>{
    var user = new User(_.pick(req.body,['email','password']))
   
    User.findByCredentials(user.email, user.password).then((user) =>{
        console.log(user);
        user.generateAuthToken().then((token) =>{
            return res.header('x-auth',token).send(user)
        })
    },()=>{
        res.status(400).send('Login failed')
    })
})

router.get('/me',authenticate, (req, res) =>{
    res.status(200).send({user:req.user})
 })

//logout
router.delete('/me/token',authenticate, (req, res) =>{
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send()
    }, () =>{
        res.status(400).send()
    })
})

router.get('/subjects/:code',(req,res) => {
    var code = req.params.code;
    
    Subject.findOne({code: code}).then((subject) => {
        if(!subject){
            return res.status(400).send();
        }
        res.send({subject: subject});
    }).catch((err) => {
        res.status(400).send();
    })
})

router.get('/Users/:username',(req,res) => {
    var username = req.params.username;
    console.log(username);
    User.findOne({username: username}).then((user) => {
        if(!user){
            return res.status(400).send();
        }
        res.send({user: user});
    }).catch((err) => {
        res.status(400).send();
    })
})

router.patch('/Users/:username',(req,res) => {
    var username = req.params.username;
    var body = _.pick(req.body,['subject','labGrade','examGrade']);


    User.findOne({username}).then( student => {
        if(!student){
           return res.status(404).send();
        }

        student.subjects.forEach(element => {
     
           
            if(element != null && element.subject === body.subject){
                
                element.labGrade = body.labGrade;
                element.examGrade = body.examGrade;

                User.findOneAndUpdate({username: username},{
                    $set: {subjects: student.subjects}
                },{
                    new: true,
                    runValidators: true
                }
                ).then((user) => {
                    if(!user){
                        return res.status(404).send();
                    }
                    console.log(user.subjects)
                    return res.send(user);
                }).catch(e=>console.log(e))
                
            }
        })

    }).catch(err => console.log(err))
 
    
})

router.patch('/Users/:username/average',(req,res) => {
    var username = req.params.username;
    User.findOne({username}).then( student => {
        if(!student){
            return res.status(404).send();
         }
         var average = 0;
         student.subjects.forEach(element => {
            //  console.log(element.labGrade);
            //  console.log(element.examGrade);
            average = average + 0.33*element.labGrade + 0.64*element.examGrade;
        })
        average = average/12;
        student.average = average;
        console.log(average);
        User.findOneAndUpdate({username},{
            $set: {average: student.average}
        },{
            new: true,
            runValidators: true
        }).then((user) => {
            if(!user){
                return res.status(404).send();
            }
            console.log(user.average);
            return res.send(user);
        }).catch(e=>console.log(e))
    }).catch(err => console.log(err))
})

router.delete('/subjects/:code',(req,res) => {
    var code = req.params.code;
    
    Subject.findOneAndDelete({code}).then((subject) => {
        if(!subject){
           return  res.status(404).send();
        }
        res.send(subject);
    }).catch((err) => {
        res.status(400).send(err);
    })
})

router.delete('/Users/:username',(req,res) => {
    var username = req.params.username;
    
    Subject.findOneAndDelete({username}).then((user) => {
        if(!user){
           return  res.status(404).send();
        }
        res.send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
})

module.exports = router
