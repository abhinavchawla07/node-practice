const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favourites = require('../models/favourites');

const favRouter = express.Router();

favRouter.use(bodyParser.json());

const postFav = (req, res, next) => {
    var addList = req.body.map((dish) => dish['_id']);
    addList = [...new Set(addList)];
    Favourites.findOne({ user: req.user._id })
        .then((fav) => {
            if (fav) {
                var dishes = fav.dishes.map((object) => object._id.toString());
                var newAddList = addList.filter((id) => !dishes.includes(id));
                fav.dishes = dishes.concat(newAddList);
                fav.save()
                    .then((fav) => {
                        Favourites.findById(fav._id)
                            .populate('users')
                            .populate('dishes')
                            .then((fav) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(fav);
                            });

                    })
            }
            else {
                fav = {
                    user: req.user._id,
                    dishes: addList
                };
                Favourites.create(fav)
                    .then((favs) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favs);
                    }, (err) => next(err))
            }
        }, (err) => next(err))
        .catch((err) => next(err));
};

favRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .populate('dishes')
            .populate('user')
            .then((favs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favs);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, postFav)
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.remove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

favRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favs) => {
                if (!favs) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ 'exists': false, 'favourites': favs });
                }
                else {
                    if (favs.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ 'exists': false, 'favourites': favs });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ 'exists': true, 'favourites': favs });
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body = [{ '_id': req.params.dishId }];
        next();
    }, postFav)
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((fav) => {
                var dishes = fav.dishes;
                fav.dishes = dishes.filter((id) => !id.equals(req.params.dishId));
                fav.save()
                    .then((fav) => {
                        Favourites.findById(fav._id)
                            .populate('users')
                            .populate('dishes')
                            .then((fav) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(fav);
                            });
                    }, (err) => next(err))
                    .catch((err) => next(err));
            })
    })

module.exports = favRouter;