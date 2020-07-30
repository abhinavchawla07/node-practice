var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');
const { Router } = require('express');

var usersRouter = express.Router();

usersRouter.use(bodyParser.json());
/* GET users listing. */

usersRouter.options('*', cors.corsWithOptions, (req, res, next) => {
	res.sendStatus(200);
});

usersRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
	Users.find({})
		.then((users) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(users);
		}, (err) => next(err))
		.catch((err) => next(err));
});

usersRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
	Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({ err: err });
		}
		else {
			if (req.body.firstname) {
				user.firstname = req.body.firstname;
			}
			if (req.body.lastname) {
				user.lastname = req.body.lastname;
			}
			user.save((err, user) => {
				if (err) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({ err: err });
					return;
				}
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ status: 'Registration Successful', success: true });
				});
			});

		}
	});
});

usersRouter.post('/login', cors.corsWithOptions, (req, res, next) => {

	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({ status: 'Login Unsuccessful', success: false, err: info });
		}
		req.logIn(user, (err) => {
			if (err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({ status: 'Could not log in user', success: false });
			}
			var token = authenticate.getToken({ _id: req.user._id });
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({ status: 'Login Successful', success: true, token: token });
		});
	}) (req, res, next);

});

usersRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	}
	else {
		var err = new Error('You are not logged in');
		err.status = 401;
		return next(err);
	}
});

usersRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
	if (req.user) {
		var token = authenticate.getToken({ _id: req.user._id });
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({ status: 'Login Successful', success: true, token: token });
	}
});

usersRouter.get('/checkJWTToken',cors.corsWithOptions,(req,res,next)=>{
	passport.authenticate('jwt',{session:false},(err,user,info)=>{
		if(err){
			return next(err);
		}
		if(!user)
		{
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			return res.json({status:'jwt invalid',success:false,err:info});
		}
		else{
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json({status:'jwt valid',success:true,user:user});
		}
	})(req,res);
})

module.exports = usersRouter;
