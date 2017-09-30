var database = require('../services/database.js');
var reportService = require('../services/reportService');
var userService = require('../services/users');
var mailNotificationService = require('../services/mailNotificationService');

var getFeedback = function (idFeedback, next) {
	database.query('SELECT * FROM feedback WHERE id=' + idFeedback, function(err, rows, fields) {
		if (err) {console.log(err);return null}
		if (rows.length == 0) {return null}
		next(rows[0]);
	});
}

var sendFeedbackNotification = function (userIdReceiver) {
	userService.getUser(userIdReceiver, function (userReceiver) {
		var fullname = userReceiver.prenom + ' ' + userReceiver.nom;
		mailNotificationService.sendFeedbackNotification(userReceiver.email, fullname);
	})
}

var sendRatingNotification = function (idFeedback) {
	getFeedback(idFeedback, function (feedback) {
		userService.getUser(feedback.fromUser, function (userReceiver) {
			userService.getUser(feedback.toUser, function (userSender) {
				var fullnameReceiver = userReceiver.prenom + ' ' + userReceiver.nom;
				var fullnameSender = userSender.prenom + ' ' + userSender.nom;
				mailNotificationService.sendRatingNotification(userReceiver.email, fullnameReceiver, fullnameSender);
			});
		});
	});
}

module.exports.addFeedback = function(toUser, fromUser, feedbackText, feedfowardText, next) {
	feedfowardText = database.escape(feedfowardText);
	feedbackText = database.escape(feedbackText);
	var query = 'INSERT INTO feedback (toUser, fromUser, feedback, feedforward, createdAt) VALUES ('+ toUser + ',' + fromUser + ',' + feedbackText + ',' + feedfowardText + ', NOW())'
	database.query(query, function(err, rows, fields) {
		if (err) {
			next(1);
		} else {
			reportService.addReportFeedback();
			sendFeedbackNotification(toUser);
			next(0);
		}
	});
}

module.exports.changeRating = function(userIdRater, ratingType, ratingValue, feedbackId) {
	userIdRater = database.escape(userIdRater);
	ratingValue = database.escape(ratingValue);
	feedbackId = database.escape(feedbackId);

	var query = 'UPDATE feedback'

	if (ratingType === 'pertinent') {
		query += ' SET isPertinent'
	} else if (ratingType === 'inspiring') {
		query += ' SET isInspiring'
	} else {
		return;
	}
	if (ratingValue === "'0'") {
		query += '=0'
	} else if (ratingValue === "'1'") {
		query += '=1'
	} else {
		return;
	}

	query += " WHERE toUser=" + userIdRater + " and id=" + feedbackId.slice(1,-1)
	database.query(query, function(err, rows, fields) {
		if (err) {
			console.log(err);
			return;
		}
		reportService.addReportRating();
		sendRatingNotification(feedbackId);
	});
}