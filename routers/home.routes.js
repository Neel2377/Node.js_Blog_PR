const express = require('express');
const homeRouter = express.Router();
const homeController = require('../controllers/homeController');

// Reader page route
homeRouter.get('/reader', homeController.readerPage);

homeRouter.get('/',homeController.defaultRoute);

// Handle POST requests to '/'
homeRouter.post('/', (req, res) => {
	// You can customize this logic as needed
	res.status(200).send('POST request to / received');
});

homeRouter.get('/admin',homeController.homePageAdmin);
// Middleware to check authentication
function isAuthenticated(req, res, next) {
	if (req.session && req.session.userId) {
		return next();
	} else {
		return res.redirect('/login');
	}
}

homeRouter.get('/blog', isAuthenticated, homeController.homePageReader);
homeRouter.get('/write',homeController.homePageWriter);


homeRouter.get('/login',homeController.login);
homeRouter.post('/login',homeController.loginHandle);

homeRouter.get('/signup',homeController.signup);
homeRouter.post('/signup',homeController.signupHandle);

homeRouter.get('/logout',homeController.logout);

module.exports = homeRouter;