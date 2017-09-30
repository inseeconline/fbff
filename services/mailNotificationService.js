var mandrill = require('mandrill-api/mandrill');
var mandrillConfig = require('../config/mail/mandrill');

mandrillClient = new mandrill.Mandrill(mandrillConfig.apiKey);

module.exports.sendFeedbackNotification = function (emailReceiver, fullNameReceiver) {
    var message = {
        "html": "Bonjour " + fullNameReceiver + ",<br/>" +
                "<p>Dans le cadre de votre programme de leadership, nous vous informons que vous avez reçu un nouveau feedback-feedforward.</p>" +
                "<p>Pour le voir, rendez-vous sur le site <a href='fbff.groupe-ifg.fr'>fbff.groupe-ifg.fr</a></p>" +
                "<p>Bien cordialement",
        "text": "Bonjour " + fullNameReceiver + "," +
                "Dans le cadre de votre programme de leadership, nous vous informons que vous avez reçu un nouveau feedback-feedforward." +
                "Pour le voir, rendezvous sur le site fbff.groupe-ifg.fr" +
                "Bien cordialement",
        "subject": "Nouveau feedback",
        "from_email": "no-reply@groupe-ifg.fr",
        "from_name": "no-reply@groupe-ifg.fr",
        "to": [{
                "email": emailReceiver,
                "name": fullNameReceiver,
                "type": "to"
            }]
    };
    mandrillClient.messages.send({"message": message}, function(result) {
        console.log('A feedback notification mail was sent on Mandrill with id : ' + result[0]._id);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
}

module.exports.sendRatingNotification = function (emailReceiver, fullNameReceiver, fullNameSender) {
    var message = {
        "html": "Bonjour " + fullNameReceiver + ",<br/>" +
                "<p>Dans le cadre de votre programme de leadership, nous vous informons que " + fullNameSender + " a évalué votre feedback-feedforward.</p>"+
                "<p>Pour le voir, rendez-vous sur le site <a href='fbff.groupe-ifg.fr'>fbff.groupe-ifg.fr</a></p>"+
                "<p>Bien cordialement</p>",
        "text": "Bonjour " + fullNameReceiver + ","+
                "Dans le cadre de votre programme de leadership, nous vous informons que " + fullNameSender + " a évalué votre feedback-feedforward."+
                "Pour le voir, rendezvous sur le site fbff.groupe-ifg.fr"+
                "Bien cordialement",
        "subject": "Nouveau feedback",
        "from_email": "no-reply@groupe-ifg.fr",
        "from_name": "no-reply@groupe-ifg.fr",
        "to": [{
                "email": emailReceiver,
                "name": fullNameReceiver,
                "type": "to"
            }]
    };
    mandrillClient.messages.send({"message": message}, function(result) {
        console.log('A rating notification mail was sent on Mandrill with id : ' + result[0]._id);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
}
