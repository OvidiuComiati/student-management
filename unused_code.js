//  User.findOneAndUpdate({username: username},{
    //     $set: body
    // },{
    //     new: true,
    //     runValidators: true
    // }
    // ).then((user) => {
    //     if(!user){
    //         return res.status(404).send();
    //     }
    //     //console.log(user)
        // user.subjects.forEach(element => {
     
           
        //     if(element.subject === body.subject){
        //         console.log(element.subject);
        //         element.labGrade = body.labGrade;
        //         element.examGrade = body.examGrade;
        //         console.log(element.labGrade);
        //         console.log(body.examGrade);
        //     }
    //     });
 
    //     res.send({user: user});
    // }).catch((err) => {
    //     res.status(400).send(err);
    // })

    
// app.patch('/subjects/:id',(req,res) => {
//     var code = req.params.id;
//     var body = _.pick(req.body,['labGrade','examGrade']);
//     console.log(body);
//     if(!ObjectID.isValid(id)){
        
//         return res.status(404).send();
//     }
    
//      Subject.findByIdAndUpdate(id,{$set: body},{new: true}).then((subject) => {
//         if(!subject){
//             console.log('invalid id');
//             return res.status(404).send();
//         }
//         res.send({subject: subject});
//     }).catch((err) => {
//         res.status(400).send();
//     })
// })
