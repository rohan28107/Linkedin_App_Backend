const express = require('express');
const {PostModel} = require('../model/Posts.model');
const postRouter = express.Router();


postRouter.get('/', async (req, res) => {
    const user = req.body.userId;

    // const posts = await PostModel.find({userId: user});

    let query = {};

    if(req.query.device){
        query.device = req.query.device
    }
    try{
        const posts_with_query = await PostModel.find({$and:[{userId: user}, {query}]});
        res.send(posts_with_query);
    }
    catch(err){
        res.send({"msg": err.message});
    }
    // res.send(posts);

    
})


postRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try{
        const post = new PostModel(payload);
        await post.save();
        res.send("Post created successfully");
    }
    catch(err){
        res.send({"msg":"Something went wrong", "error": err.message});
    }
})


// postRouter.post("/top", async (req, res) => {
//     const user = req.body.userId;

//     const posts = await PostModel.find({userid: user});
//     let maxCommentCount = Math.max(posts.no_if_comments)
//     const posts_with_max = await PostModel.find($and: {{userid: user},{}});
//     res.send(posts);
// })

postRouter.patch('/update/:id', async (req, res) => {
    const postId = req.params.id;
    const payload = req.body
    const post = await PostModel.findOne({"_id": postId});
    const userId_in_post = post.postId;
    const userId_making_req = req.body.userId;

    try{
        if(userId_making_req!==userId_in_post){
            res.send({"msg":"You are not allowed to update this post"});
        }else{
            await PostModel.findByIdAndUpdate({_id: postId}, payload);
            res.send({"msg":"Updated this post"});
        }
    }
    catch(err){
        res.send({"msg": `Post with id ${postId} is not found`})
    }
})


postRouter.delete('/delete/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await PostModel.findOne({"_id": postId});
    const userId_in_post = post.postId;
    const userId_making_req = req.body.userId;

    try{
        if(userId_making_req!==userId_in_post){
            res.send({"msg":"You are not allowed to delete this post"});
        }else{
            await PostModel.findByIdAndDelete({_id: postId});
            res.send({"msg":"Post is deleted successfully"});
        }
    }
    catch(err){
        res.send({"msg": `Post with id ${postId} is not found`})
    }
})


module.exports={
    postRouter
}