# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: 127.0.0.1 (MySQL 5.6.25)
# Base de données: IFG
# Temps de génération: 2015-06-22 14:26:45 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table feedback
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feedback`;

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromUser` int(11) DEFAULT NULL,
  `toUser` int(11) DEFAULT NULL,
  `isPertinent` tinyint(1) DEFAULT NULL,
  `isInspiring` tinyint(1) DEFAULT NULL,
  `feedback` text,
  `feedforward` text,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fromUser` (`fromUser`),
  KEY `toUser` (`toUser`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`fromUser`) REFERENCES `user` (`id`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`toUser`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;

INSERT INTO `feedback` (`id`, `fromUser`, `toUser`, `isPertinent`, `isInspiring`, `feedback`, `feedforward`, `createdAt`)
VALUES
	(7,4,2,1,0,'TrÃ¨s bien','Continue comme Ã§a!','2015-06-11 14:27:42'),
	(8,4,2,1,1,'Blabla','Blabla','2015-06-01 13:27:42'),
	(9,4,2,0,1,'Bla','Blabla','2015-06-10 12:27:42'),
	(13,4,2,NULL,NULL,'Blabla','aa','2014-03-11 11:27:42'),
	(14,1,2,NULL,NULL,'aa','a','2015-06-11 14:27:42'),
	(15,1,4,0,1,'TrÃ¨s bien!','Continue comme Ã§a!','2015-06-11 14:27:42'),
	(16,2,4,0,0,'Blabla','Bla','2015-06-11 16:27:42'),
	(17,1,4,0,1,'Bla','Blabla','2015-06-11 17:27:42'),
	(41,2,4,NULL,NULL,'a','a','2015-06-19 17:22:53'),
	(42,2,4,NULL,NULL,'aa','a','2015-06-19 17:23:40');

/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table reportWeek
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reportWeek`;

CREATE TABLE `reportWeek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `week` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `feedbacks` int(11) DEFAULT NULL,
  `ratings` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `reportWeek` WRITE;
/*!40000 ALTER TABLE `reportWeek` DISABLE KEYS */;

INSERT INTO `reportWeek` (`id`, `week`, `year`, `feedbacks`, `ratings`)
VALUES
	(2,25,2015,18,138),
	(3,24,2015,15,3);

/*!40000 ALTER TABLE `reportWeek` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) DEFAULT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `poste` varchar(255) DEFAULT NULL,
  `cohorte` varchar(255) DEFAULT NULL,
  `isCoach` tinyint(1) DEFAULT '0',
  `selfDescription` text,
  `personalProject` text,
  `picture` char(255) DEFAULT '/images/profil.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `login`, `nom`, `prenom`, `email`, `password`, `poste`, `cohorte`, `isCoach`, `selfDescription`, `personalProject`, `picture`)
VALUES
	(1,'login2','Dumas','Estelle','estelled@aa.aa','456','Scrum Master','Cohorte 1',0,'CCC','DDD','/images/profil.png'),
	(2,'login3','ABC','Raphael','aa@aa.aa','123','Mon poste','Cohorte 1',0,'EEE','FFF','/images/profil.png'),
	(3,'login4','E','Sophie','sophie@aa.aa','123','Participant','Cohorte 1',0,NULL,NULL,'/images/profil.png'),
	(4,'login1','Michel','Benjamin','benjaminm@bamlab.fr','123','Developpeur','Cohorte 1',0,'AAA','BBBB','/images/1511434982948035.png'),
	(5,'coach','coach','coach',NULL,'coach','coach','Cohorte 1',1,NULL,NULL,'/images/profil.png'),
	(6,'justin','Templemore','Justin','templemo@ece.fr ','123','PO','Cohorte 1',0,NULL,NULL,'/images/profil.png'),
	(26,'login5','Jean','Jacques','bb@aa.aa','123','Mon poste','Cohorte 2',0,NULL,NULL,'/images/profil.png'),
	(27,'login6','Jac','Jaa','b@aa.aa','123','Mon poste','Cohorte 2',0,NULL,NULL,'/images/profil.png'),
	(28,'login7','Jacqes','Jee','b@aa.aa','123','Mon poste','Cohorte 2',0,NULL,NULL,'/images/profil.png');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
