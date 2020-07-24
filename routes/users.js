var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');

var usersRouter = express.Router();

usersRouter.use(bodyParser.json());
/* GET users listing. */
usersRouter.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

usersRouter.post('/signup', (req, res, next) => {
	Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({ err: err });
		}
		else {
			passport.authenticate('local')(req, res, () => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({ status: 'Registration Successful', success: true });
			});
		}
	});
});

usersRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ status: 'Login Successful', success: true });
});

usersRouter.get('/logout', (req, res, next) => {
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

module.exports = usersRouter;
