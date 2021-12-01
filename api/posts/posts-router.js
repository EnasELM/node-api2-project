// implement your posts router here
const express = require('express'); // commonjs
const { post } = require('request');
const server = require('../server');
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) => {
    // data from the req
    // req.params
    // req.body
    // req.query
    console.log(req.query)
  
    Posts.find(req.query)
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message:  "The posts information could not be retrieved" ,
        });
      });
  });

  router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
      .then(posts => {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message:  "The post information could not be retrieved" ,
        });
      });
  });

  router.post('/', (req, res) => {
   
          if (!req.body.title || !req.body.contents){
            res.status(400).json({ message: "Please provide title and contents for the post" });
 
          }else{ 
            Posts.insert(req.body)
            .then(({id})=> {
             return Posts.findById(id)
    })
    .then(posts => {
        res.status(201).json(posts);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
          }
      
     
  });
 


router.put('/:id',  (req, res) =>{
    
        const { title, contents } = req.body
        if (!title || !contents){
            res.status(400).json({
                message: "Please provide title and contents for the post" ,
            })
       
        } else {
            Posts.findById(req.params.id)
               .then(stuff => {
                   if(!stuff){ 

                res.status(404).json({
                    message: "The post with the specified ID does not exist" ,
               })
               
            } else {
             return  Posts.update(req.params.id, req.body)
              
            }
        })
        .then(data => {
            if (data){
                return Posts.findById(req.params.id)
            }
        })
      .then(post => {
          if (post){
              res.json(post)
          }
      })
     .catch (err =>{
    res.status(500).json({
        message: "error updating user",
        err: err.message,
        stack:err.stack
    })
})
}
})
router.delete("/:id", async (req, res) => {
    try {
      const possiblePosts = await Posts.findById(req.params.id);
      if (!possiblePosts) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
         await Posts.remove(req.params.id);
        res.status(200).json(possiblePosts);
      }
    } catch (err) {
      res.status(500).json({
        message: "error deleting user",
        err: err.message,
        stack: err.stack,
      });
    }
  });

  router.get('/:id/comments', async (req, res) => {
    try {
      const comment = await Posts.findPostComments(req.params.id)
      if (!comment.length) {
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        })
      } else {
        res.status(200).json(comment)
      }
    } catch (err) {
      res.status(500).json({
        message: process.env.NODE_ENV === 'production' ? "The comments information could not be retrieved" : err.message,
      })
    }
  });
  
  

module.exports= router;