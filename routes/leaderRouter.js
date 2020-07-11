const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end("send back all the leaders");
})
.post((req,res,next)=>{
    res.end("add the leader " + req.body.name
    + " with description " + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT operation forbidden");
})
.delete((req,res,next)=>{
    res.end("delete all the leaders");
});



leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    res.end("send back leader " + req.params.leaderId);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("POST operation forbidden on " + req.params.leaderId);
})
.put((req,res,next)=>{
    res.write('Updating the leader '+req.params.leaderId + '\n');
    res.end('Will update leader '+req.body.name + ' with details '+req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleting leader "+req.params.leaderId);
});

module.exports = leaderRouter;