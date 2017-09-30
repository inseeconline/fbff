# ECE_IFG

Pour installer le projet :
npm install

Puis installer une base de données MySQL et importer sql/IFG.sql

Pour lancer le projet :
npm start

## Vocabulaire

Un utilisateur est soit un utilisateur, soit un coach :
* un utilisateur peut voir les feedbacks qu'il a laissé sur les pages de profil des autres participants et évaluer les feedbacks qu'il a reçus selon deux critères : inspirant et pertinent
* un coach a accès à tout les feedbacks mais ne peut pas en laisser

Une cohorte est une promotion de participants.

## Format du CSV pour importer les comptes utilisateurs

login,prenom,nom,mail,mot de passe,poste,cohorte

Pour importer un CSV, il faut être connecté en tant que coach (login: coach, mot de passe: coach).

## Production

URL de production : http://fbff.groupe-ifg.fr/
La production est hébergée sur Openshift : http://leader-benjaminbam.rhcloud.com/

## Base de données en production

Configuration pour la production:

```
module.exports = {
	host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
	user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
	password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
	database : 'IFG',
	port 	 : process.env.OPENSHIFT_MYSQL_DB_PORT
}
```
