-- MySQL dump 10.16  Distrib 10.1.38-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: flood
-- ------------------------------------------------------
-- Server version	10.1.38-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `battle_effects_values`
--

DROP TABLE IF EXISTS `battle_effects_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battle_effects_values` (
  `id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(5) NOT NULL,
  `value` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `battle_style_values`
--

DROP TABLE IF EXISTS `battle_style_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battle_style_values` (
  `id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `effect_volume_values`
--

DROP TABLE IF EXISTS `effect_volume_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `effect_volume_values` (
  `id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT,
  `value` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `keybindings`
--

DROP TABLE IF EXISTS `keybindings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keybindings` (
  `id` varchar(25) NOT NULL,
  `action` varchar(10) NOT NULL,
  `binding1` varchar(25) DEFAULT NULL,
  `binding2` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`,`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `music_volume_values`
--

DROP TABLE IF EXISTS `music_volume_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `music_volume_values` (
  `id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT,
  `value` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options` (
  `id` varchar(25) NOT NULL,
  `text_speed` tinyint(1) unsigned NOT NULL,
  `battle_effects` tinyint(1) unsigned NOT NULL,
  `battle_style` tinyint(1) unsigned NOT NULL,
  `music_volume` tinyint(1) unsigned NOT NULL,
  `effect_volume` tinyint(1) unsigned NOT NULL,
  `pokemon_cries` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `text_speed` (`text_speed`),
  KEY `battle_effects` (`battle_effects`),
  KEY `battle_style` (`battle_style`),
  KEY `music_volume` (`music_volume`),
  KEY `effect_volume` (`effect_volume`),
  KEY `pokemon_cries` (`pokemon_cries`),
  CONSTRAINT `options_ibfk_1` FOREIGN KEY (`text_speed`) REFERENCES `text_speed_values` (`id`),
  CONSTRAINT `options_ibfk_2` FOREIGN KEY (`battle_effects`) REFERENCES `battle_effects_values` (`id`),
  CONSTRAINT `options_ibfk_3` FOREIGN KEY (`battle_style`) REFERENCES `battle_style_values` (`id`),
  CONSTRAINT `options_ibfk_4` FOREIGN KEY (`music_volume`) REFERENCES `music_volume_values` (`id`),
  CONSTRAINT `options_ibfk_5` FOREIGN KEY (`effect_volume`) REFERENCES `effect_volume_values` (`id`),
  CONSTRAINT `options_ibfk_6` FOREIGN KEY (`pokemon_cries`) REFERENCES `pokemon_cries_values` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pokemon_cries_values`
--

DROP TABLE IF EXISTS `pokemon_cries_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pokemon_cries_values` (
  `id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT,
  `value` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `text_speed_values`
--

DROP TABLE IF EXISTS `text_speed_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `text_speed_values` (
  `id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `modifier` float unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-29  4:05:20
-- MySQL dump 10.16  Distrib 10.1.38-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: flood
-- ------------------------------------------------------
-- Server version	10.1.38-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `battle_effects_values`
--

LOCK TABLES `battle_effects_values` WRITE;
/*!40000 ALTER TABLE `battle_effects_values` DISABLE KEYS */;
INSERT INTO `battle_effects_values` VALUES (1,'On',1),(2,'Off',0);
/*!40000 ALTER TABLE `battle_effects_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `battle_style_values`
--

LOCK TABLES `battle_style_values` WRITE;
/*!40000 ALTER TABLE `battle_style_values` DISABLE KEYS */;
INSERT INTO `battle_style_values` VALUES (1,'Switch'),(2,'Set');
/*!40000 ALTER TABLE `battle_style_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `effect_volume_values`
--

LOCK TABLES `effect_volume_values` WRITE;
/*!40000 ALTER TABLE `effect_volume_values` DISABLE KEYS */;
INSERT INTO `effect_volume_values` VALUES (1,0),(2,1),(3,2),(4,3),(5,4),(6,5);
/*!40000 ALTER TABLE `effect_volume_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `music_volume_values`
--

LOCK TABLES `music_volume_values` WRITE;
/*!40000 ALTER TABLE `music_volume_values` DISABLE KEYS */;
INSERT INTO `music_volume_values` VALUES (1,0),(2,1),(3,2),(4,3),(5,4),(6,5);
/*!40000 ALTER TABLE `music_volume_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pokemon_cries_values`
--

LOCK TABLES `pokemon_cries_values` WRITE;
/*!40000 ALTER TABLE `pokemon_cries_values` DISABLE KEYS */;
INSERT INTO `pokemon_cries_values` VALUES (1,0),(2,1),(3,2),(4,3),(5,4),(6,5);
/*!40000 ALTER TABLE `pokemon_cries_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `text_speed_values`
--

LOCK TABLES `text_speed_values` WRITE;
/*!40000 ALTER TABLE `text_speed_values` DISABLE KEYS */;
INSERT INTO `text_speed_values` VALUES (1,'Slow',0.5),(2,'Normal',1),(3,'Fast',2);
/*!40000 ALTER TABLE `text_speed_values` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-29  4:05:20
