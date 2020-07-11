const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end("send back all the dishes");
})
.post((req,res,next)=>{
    res.end("add the dish " + req.body.name
    + " with description " + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT operation forbidden");
})
.delete((req,res,next)=>{
    res.end("delete all the dishes");
});

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    res.end("send back dish " + req.params.dishId);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("POST operation forbidden on " + req.params.dishId);
})
.put((req,res,next)=>{
    res.write('Updating the dish '+req.params.dishId + '\n');
    res.end('Will update dish '+req.body.name + ' with details '+req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleting dish "+req.params.dishId);
});

module.exports = dishRouter;