const express = require('express');
const {UserModel} = require("../model/User.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userRouter = express.Router();

userRouter.post('/register', async(req, res) => {
    const {name, email, password, gender, age, city} = req.body;

    try{
        bcrypt.hash(password, 5, async(err, hash) =>{
            if(err){
                res.send({"msg":"New user is not registered", "error":err.message});
            }else{
                const user = new UserModel({name, email, password:hash, gender, age, city});
                await user.save();
                res.send({"msg":"New user is registered"})
            }
        })
    }   
    catch(err){
        res.send({"msg":"New user is not registered", "error":err.message});
    }
})


userRouter.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email});

        if(user.length>0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(result){
                    let token = jwt.sign({userId:user[0]._id}, "masai");
                    res.send({"msg":"Logged in Successfully", "token":token});
                }else{
                    res.send({"msg":"New User is not logged in"});
                }
            })
        }else{
            res.send({"msg":"Wrong Credentails"});
        }
    }   
    catch(err){
        res.send({"msg":"User is not logged in", "error":err.message});
    }
})

module.exports={
    userRouter
}