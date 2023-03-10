const express = require('express');
const { connection } = require('./db');
require('dotenv').config();
const {userRouter} = require("./routes/User.routes");
const {postRouter} = require('./routes/Posts.routes'); 
const {authenticate} = require("./middlewares/authenticate.middleware");
const cors = require('cors');



const app = express();
app.use(express.json());
app.use(cors());


app.use("/users", userRouter);
app.use(authenticate);
app.use('/posts', postRouter);

app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Connected to DB")
    }
    catch(err){
        console.log(err);
    }
    console.log(`Running on port ${process.env.PORT}`);
})