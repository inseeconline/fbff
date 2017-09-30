var moment = require('moment-timezone');

moment.locale('fr');
moment.locale('fr', {
    calendar : {
        sameDay: '[Aujourd\'hui à] LT',
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L [à] LT'
    }
});

module.exports.formatDate = function(date) {
	return moment(date).tz('Europe/Paris').calendar();
}

module.exports.getCurrentWeek = function () {
	return moment().tz('Europe/Paris').format('ww');
}

module.exports.getCurrentYear = function () {
	return (new Date()).getFullYear();;
}