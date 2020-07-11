const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end("send back all the promos");
})
.post((req,res,next)=>{
    res.end("add the promo " + req.body.name
    + " with description " + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT operation forbidden");
})
.delete((req,res,next)=>{
    res.end("delete all the promos");
});



promoRouter.route('/:promoId')
.get((req,res,next)=>{
    res.end("send back promo " + req.params.promoId);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("POST operation forbidden on " + req.params.promoId);
})
.put((req,res,next)=>{
    res.write('Updating the promo '+req.params.promoId + '\n');
    res.end('Will update promo '+req.body.name + ' with details '+req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleting promo "+req.params.promoId);
});

module.exports = promoRouter;