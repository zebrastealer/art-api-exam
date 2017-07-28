CREATE DATABASE  IF NOT EXISTS `art-mysql-exam` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `art-mysql-exam`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 0.0.0.0    Database: art-mysql-exam
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `artcitycount`
--

DROP TABLE IF EXISTS `artcitycount`;
/*!50001 DROP VIEW IF EXISTS `artcitycount`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `artcitycount` AS SELECT 
 1 AS `City Painting Count`,
 1 AS `City`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `movement`
--

DROP TABLE IF EXISTS `movement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movement` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `movementName` varchar(45) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `movementName_UNIQUE` (`movementName`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movement`
--

LOCK TABLES `movement` WRITE;
/*!40000 ALTER TABLE `movement` DISABLE KEYS */;
INSERT INTO `movement` VALUES (5,'Abstract art'),(8,'Abstract expressionism'),(11,'Art Nouveau'),(17,'Classicism'),(9,'Contempary art'),(1,'Cubism'),(2,'Expressionism'),(12,'Fauvism'),(10,'Futurism'),(4,'Impressionism'),(7,'Modern art'),(14,'Modernism'),(3,'Pop art'),(13,'Post-impressionism'),(16,'Renaissance'),(15,'Romanticism'),(6,'Surrealism');
/*!40000 ALTER TABLE `movement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `museumName`
--

DROP TABLE IF EXISTS `museumName`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `museumName` (
  `_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `museum` varchar(90) NOT NULL,
  `locationCity` varchar(180) NOT NULL,
  `locationState` varchar(45) DEFAULT NULL,
  `locationCountry` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `museum_UNIQUE` (`museum`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `museumName`
--

LOCK TABLES `museumName` WRITE;
/*!40000 ALTER TABLE `museumName` DISABLE KEYS */;
INSERT INTO `museumName` VALUES (1,'Salvador Dali Museum','St. Petesburg','Florida','USA'),(2,'Santa Maria delle Grazie','Milan',NULL,'Italy'),(3,'Museum of Modern Art','New York City','New York','USA'),(4,'Art Institute of Chicago','Chicago','Illinois','USA'),(5,'Art Gallery of Ontario','Toronto',NULL,'Canada'),(6,'Musée d’Orsay','Paris',NULL,'France'),(7,'Uffizi Gallery','Florence','','Italy'),(8,'National Gallery','London',NULL,'England'),(9,'Sistine Chapel','Florence',NULL,'Italy'),(10,'Galleria dell\'Accademia','Florence',NULL,'Italy');
/*!40000 ALTER TABLE `museumName` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `painting`
--

DROP TABLE IF EXISTS `painting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `painting` (
  `_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(180) NOT NULL,
  `type` varchar(45) NOT NULL DEFAULT 'painting',
  `artist` varchar(45) NOT NULL,
  `yearCreated` int(4) NOT NULL,
  `museumName` varchar(90) NOT NULL,
  `movementName` varchar(45) NOT NULL,
  `locationCity` varchar(180) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `museum_idx` (`museumName`),
  KEY `movementName_idx` (`movementName`),
  CONSTRAINT `museum` FOREIGN KEY (`museumName`) REFERENCES `museumName` (`museum`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `painting`
--

LOCK TABLES `painting` WRITE;
/*!40000 ALTER TABLE `painting` DISABLE KEYS */;
INSERT INTO `painting` VALUES (2,'Painting 1','painting','Salvador Dali',1937,'Salvador Dali Museum','surrealism','St. Petesburg'),(5,'The Newer Archeological Reminiscence of Millet\'s AngelusArcheological Reminiscence of Millet\'s Angelus','painting','Salvador Dali',1935,'Salvador Dali Museum','surrealism','Florida'),(7,'The Last Supper','painting','Leonardo da Vinci',1495,'Santa Maria delle Grazie','Renaissance','Milan'),(8,'The Starry Night','painting','Vincent van Gogh',1889,'Museum of Modern Art','post-impressionism','New York'),(9,'A Sunday Afternoon on the Island of La Grande Jatte','painting','Georges Seurat',1884,'Art Institute of Chicago','impressionism','Chicago'),(10,'Water Lilies Nympheas','painting','Claude Monet',1907,'Art Gallery of Ontario','impressionism','Toronto'),(11,'Bal du moulin de la Galette','painting','Pierre-Auguste Renoires',1876,'Musée d’Orsay','impressionism','Paris'),(12,'Doni Tondo','painting','Michaelangelo',1506,'Uffizi Gallery','Renaissance','Florenece'),(13,'The Entombment','painting','Michaelangelo the Great',1501,'National Gallery','Renaissance','London'),(14,'Sistine Chapel ceiling','painting','Michaelangelo the Great',1512,'Sistine Chapel','Renaissance','Florenece'),(15,'The Creation of Adam','painting','Michaelangelo the Great',1504,'Galleria dell\'Accademia','Renaissance','Florenece'),(16,'The Creation of Adam - Forgery','painting','Michaelangelo the Great',1504,'Galleria dell\'Accademia','Renaissance','Florenece');
/*!40000 ALTER TABLE `painting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `paintinglist`
--

DROP TABLE IF EXISTS `paintinglist`;
/*!50001 DROP VIEW IF EXISTS `paintinglist`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `paintinglist` AS SELECT 
 1 AS `Name`,
 1 AS `Artist`,
 1 AS `Year`,
 1 AS `Museum`,
 1 AS `City`,
 1 AS `Movement`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `artcitycount`
--

/*!50001 DROP VIEW IF EXISTS `artcitycount`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `artcitycount` AS select count(`painting`.`_id`) AS `City Painting Count`,`painting`.`locationCity` AS `City` from `painting` group by `painting`.`locationCity` order by `City Painting Count` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `paintinglist`
--

/*!50001 DROP VIEW IF EXISTS `paintinglist`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `paintinglist` AS select `painting`.`name` AS `Name`,`painting`.`artist` AS `Artist`,`painting`.`yearCreated` AS `Year`,`painting`.`museumName` AS `Museum`,`painting`.`locationCity` AS `City`,`painting`.`movementName` AS `Movement` from `painting` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-28 15:45:59
