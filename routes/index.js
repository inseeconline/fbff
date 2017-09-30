var express = require('express');
var router = express.Router();
var database = require('../services/database.js');
var userService = require('../services/users.js');
var feedbackService = require('../services/feedbacks.js');
var multer  = require('multer');

var filepathProfilePicture;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});

router.get('/login', function(req, res, next) {
	if (req.session.user !== null && req.session.user !== undefined){
		res.redirect('/home');
		return
	}
	res.render('login');
})

router.post('/login', function(req, res){
	if (req.session.user !== null && req.session.user !== undefined){
		res.redirect('/home');
		return
	}
	var login = req.body.login;
	var password = req.body.password;
    database.query('SELECT * FROM user WHERE login=\''+login+'\' AND password=\''+password+'\'', function(err, rows, fields) {
		if (err) { console.log(err); return;}

		if(rows.length == 1) {
		    req.session.user = {
		        id: rows[0].id,
		        email: login,
		        nom: rows[0].nom,
		        prenom: rows[0].prenom,
		        email: rows[0].email,
		        poste: rows[0].poste,
		        cohorte: rows[0].cohorte,
		        isCoach: rows[0].isCoach === 1
		    };

		    res.redirect("/home")
		    res.end();
		} else {
			res.render('login', { message: 'Le login ou le mot de passe est incorrect'});
		}
	});
});

router.get('/logout',function(req, res){
	req.session.destroy();
	res.redirect('/login');
	return;
});

router.get('/home', function(req, res) {
	if(userService.checkAuth(req, res)){
		userService.getParticipantsOfYourCohorte(req.session.user.isCoach ? null : req.session.user.cohorte, function (users) {
			res.render('home', {userConnected: req.session.user, users: users});
		})
	}
})

router.get('/user/:userId/:feedbackPostReturnCode?', function(req, res){
	var canPostFeedback = false
	feedbackPostReturnCode = req.params.feedbackPostReturnCode || null
	if(userService.checkAuth(req, res)){
		if (!userService.isCoach(req)){
			if (req.params.userId != req.session.user.id){
				userService.getUserWithFeedbackSent(req.params.userId, req.session.user.id, function(user) {
					canPostFeedback = req.session.user.cohorte === user.cohorte;
					res.render('user', {
						userConnected: req.session.user,
						user: user,
						feedbackPostReturnCode: feedbackPostReturnCode,
						isMyProfile: false,
						canPostFeedback: canPostFeedback,
						isCoach: false
					});
				})
			} else {
				userService.getUserWithFeedbackSentAndReceived(req.params.userId, function(user) {
					res.render('user', {
						userConnected: req.session.user,
						user: user,
						feedbackPostReturnCode: feedbackPostReturnCode,
						isMyProfile: true,
						canPostFeedback: canPostFeedback,
						isCoach: false
					});
				})
			}
		} else { // coach view
			userService.getUserWithFeedbackSentAndReceived(req.params.userId, function(user) {
				res.render('user', {
					userConnected: req.session.user,
					user: user,
					feedbackPostReturnCode: feedbackPostReturnCode,
					isMyProfile: false,
					canPostFeedback: canPostFeedback,
					isCoach: true
				});
			})
		}
	}
})

router.post('/user/:userId/feedback', function(req,res){
	if(userService.checkAuth(req, res)){
		feedbackService.addFeedback(req.params.userId, req.session.user.id, req.body.feedback, req.body.feedforward, function(outputCode){
			res.redirect('/user/' + req.params.userId + '/' + outputCode);
		});
	}
});

router.post('/user/:userId/feedback/:feedbackId/:ratingType/:ratingValue', function(req, res){
	if (req.session.user !== null && req.session.user !== undefined){
		feedbackService.changeRating(req.session.user.id, req.params.ratingType, req.params.ratingValue, req.params.feedbackId)
	}
})

router.post('/user/:userId/selfDescriptionAndProject', function (req, res) {
	if (userService.checkAuth(req, res)) {
		userService.updateDescriptionAndProject(req.session.user.id, req.body.selfDescription, req.body.personalProject, function() {
			res.redirect('/user/' + req.params.userId + '/');
		});
	}
});

router.post('/user/:userId/changePicture',
	multer({ dest:  __dirname + '/../public/images/',
	  rename: function (fieldname, filename) {
	    return filename+Date.now();
	  },
	  onFileUploadStart: function (file) {
	    console.log(file.originalname + ' is starting ...')
	  },
	  onFileUploadComplete: function (file) {
	    console.log(file.fieldname + ' uploaded to  ' + file.path)
	    filepathProfilePicture = '/images/' + file.name;
	    done = true;
	  }
	}),
	function (req, res) {
		if (done == true) {
			userService.changePicture(req.session.user.id, filepathProfilePicture, function(){
				res.redirect('/user/' + req.params.userId + '/');
			});
		}
	}
);

module.exports = router;
