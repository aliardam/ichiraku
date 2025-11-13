CREATE DATABASE  IF NOT EXISTS `japanese_restaurant` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `japanese_restaurant`;
-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: localhost    Database: japanese_restaurant
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '166cb258-b2aa-11f0-b758-74f880997fb1:1-60';

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Appetizers','Light starters to begin your meal'),(2,'Main Dishes','Traditional and modern Japanese main courses'),(3,'Desserts','Sweet endings to your dining experience'),(4,'Drinks','Refreshing beverages and teas');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Drink_Sizes`
--

DROP TABLE IF EXISTS `Drink_Sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Drink_Sizes` (
  `drink_id` int NOT NULL,
  `size` enum('Regular','Large') NOT NULL,
  `price` decimal(6,2) NOT NULL,
  PRIMARY KEY (`drink_id`,`size`),
  CONSTRAINT `drink_sizes_ibfk_1` FOREIGN KEY (`drink_id`) REFERENCES `Menu_Items` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Drink_Sizes`
--

LOCK TABLES `Drink_Sizes` WRITE;
/*!40000 ALTER TABLE `Drink_Sizes` DISABLE KEYS */;
INSERT INTO `Drink_Sizes` VALUES (10,'Regular',2.50),(10,'Large',3.50),(11,'Regular',3.00),(11,'Large',4.00),(12,'Regular',4.50),(12,'Large',5.50);
/*!40000 ALTER TABLE `Drink_Sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ingredients`
--

DROP TABLE IF EXISTS `Ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ingredients` (
  `ingredient_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `allergen` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ingredients`
--

LOCK TABLES `Ingredients` WRITE;
/*!40000 ALTER TABLE `Ingredients` DISABLE KEYS */;
INSERT INTO `Ingredients` VALUES (1,'Soy Sauce','Soy'),(2,'Rice',NULL),(3,'Seaweed',NULL),(4,'Salmon','Fish'),(5,'Shrimp','Shellfish'),(6,'Egg','Egg'),(7,'Sugar',NULL),(8,'Flour','Gluten'),(9,'Milk','Dairy'),(10,'Matcha Powder',NULL),(11,'Tofu','Soy'),(12,'Chicken',NULL),(13,'Green Tea Leaves',NULL),(14,'Noodles','Gluten'),(15,'Red Bean Paste',NULL),(16,'Vegetable Oil',NULL),(17,'Dashi Broth','Fish'),(18,'Teriyaki Sauce','Soy'),(19,'Ice Cream','Dairy'),(20,'Carbonated Water',NULL),(21,'Sugar Syrup',NULL),(22,'Cream Cheese','Dairy'),(23,'Butter','Dairy'),(24,'Soy Sauce','Soy'),(25,'Rice',NULL),(26,'Seaweed',NULL),(27,'Salmon','Fish'),(28,'Shrimp','Shellfish'),(29,'Egg','Egg'),(30,'Sugar',NULL),(31,'Flour','Gluten'),(32,'Milk','Dairy'),(33,'Matcha Powder',NULL),(34,'Tofu','Soy'),(35,'Chicken',NULL),(36,'Green Tea Leaves',NULL),(37,'Noodles','Gluten'),(38,'Red Bean Paste',NULL),(39,'Vegetable Oil',NULL),(40,'Dashi Broth','Fish'),(41,'Teriyaki Sauce','Soy'),(42,'Ice Cream','Dairy'),(43,'Carbonated Water',NULL),(44,'Sugar Syrup',NULL),(45,'Cream Cheese','Dairy'),(46,'Butter','Dairy'),(47,'Crab Stick','Shellfish'),(48,'Avocado',NULL),(49,'Cucumber',NULL),(50,'Crab Stick','Shellfish'),(51,'Avocado',NULL),(52,'Cucumber',NULL);
/*!40000 ALTER TABLE `Ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item_Ingredients`
--

DROP TABLE IF EXISTS `Item_Ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Item_Ingredients` (
  `item_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  PRIMARY KEY (`item_id`,`ingredient_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `item_ingredients_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Menu_Items` (`item_id`),
  CONSTRAINT `item_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `Ingredients` (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item_Ingredients`
--

LOCK TABLES `Item_Ingredients` WRITE;
/*!40000 ALTER TABLE `Item_Ingredients` DISABLE KEYS */;
INSERT INTO `Item_Ingredients` VALUES (1,1),(2,1),(3,1),(5,1),(6,1),(13,1),(14,1),(4,2),(5,2),(13,2),(14,2),(5,3),(13,3),(14,3),(5,4),(6,6),(9,6),(8,7),(9,7),(12,7),(2,8),(7,8),(9,8),(8,9),(12,9),(8,10),(12,10),(2,11),(3,11),(14,11),(4,12),(6,12),(10,13),(6,14),(9,15),(2,16),(3,16),(3,17),(6,17),(4,18),(7,19),(11,20),(11,21),(8,22),(8,23),(13,47),(13,48),(14,48),(13,49),(14,49);
/*!40000 ALTER TABLE `Item_Ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Menu_Items`
--

DROP TABLE IF EXISTS `Menu_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Menu_Items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(6,2) NOT NULL,
  `category_id` int NOT NULL,
  `is_drink` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`item_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Menu_Items`
--

LOCK TABLES `Menu_Items` WRITE;
/*!40000 ALTER TABLE `Menu_Items` DISABLE KEYS */;
INSERT INTO `Menu_Items` VALUES (1,'Edamame','Steamed young soybeans with sea salt',5.50,1,0),(2,'Gyoza','Pan-fried dumplings filled with pork and vegetables',6.90,1,0),(3,'Agedashi Tofu','Crispy tofu served in light soy broth',7.50,1,0),(4,'Chicken Teriyaki','Grilled chicken glazed with teriyaki sauce, served with rice',14.90,2,0),(5,'Salmon Donburi','Fresh salmon slices served over seasoned rice',16.50,2,0),(6,'Ramen','Japanese noodle soup with pork, egg, and vegetables',12.90,2,0),(7,'Mochi Ice Cream','Soft rice cakes filled with ice cream',6.00,3,0),(8,'Matcha Cheesecake','Cheesecake flavored with Japanese green tea',7.50,3,0),(9,'Dorayaki','Sweet pancakes filled with red bean paste',5.90,3,0),(10,'Green Tea','Traditional Japanese hot tea',3.50,4,1),(11,'Ramune','Japanese carbonated soft drink',3.00,4,1),(12,'Matcha Latte','Creamy milk drink with matcha powder',4.50,4,1),(13,'California Roll','Sushi roll with crab, avocado, cucumber, and rice wrapped in seaweed',9.90,2,0),(14,'Vegetable Sushi Roll','Fresh sushi roll with cucumber, avocado, and tofu',8.50,2,0),(15,'California Roll','Sushi roll with crab, avocado, cucumber, and rice wrapped in seaweed',9.90,2,0),(16,'Vegetable Sushi Roll','Fresh sushi roll with cucumber, avocado, and tofu',8.50,2,0);
/*!40000 ALTER TABLE `Menu_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `menu_with_allergens`
--

DROP TABLE IF EXISTS `menu_with_allergens`;
/*!50001 DROP VIEW IF EXISTS `menu_with_allergens`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `menu_with_allergens` AS SELECT 
 1 AS `item_id`,
 1 AS `item_name`,
 1 AS `description`,
 1 AS `price`,
 1 AS `category`,
 1 AS `ingredients`,
 1 AS `allergens`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Order_Items`
--

DROP TABLE IF EXISTS `Order_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order_Items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `Menu_Items` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order_Items`
--

LOCK TABLES `Order_Items` WRITE;
/*!40000 ALTER TABLE `Order_Items` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `order_type` enum('dine-in','delivery') NOT NULL,
  `table_number` int DEFAULT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'pending',
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  CONSTRAINT `chk_email_or_phone` CHECK (((`email` is not null) or (`phone` is not null)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `menu_with_allergens`
--

/*!50001 DROP VIEW IF EXISTS `menu_with_allergens`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `menu_with_allergens` AS select `mi`.`item_id` AS `item_id`,`mi`.`name` AS `item_name`,`mi`.`description` AS `description`,`mi`.`price` AS `price`,`c`.`name` AS `category`,group_concat(distinct `ing`.`name` order by `ing`.`name` ASC separator ', ') AS `ingredients`,group_concat(distinct `ing`.`allergen` order by `ing`.`allergen` ASC separator ', ') AS `allergens` from (((`menu_items` `mi` join `categories` `c` on((`mi`.`category_id` = `c`.`category_id`))) left join `item_ingredients` `ii` on((`mi`.`item_id` = `ii`.`item_id`))) left join `ingredients` `ing` on((`ii`.`ingredient_id` = `ing`.`ingredient_id`))) group by `mi`.`item_id`,`mi`.`name`,`mi`.`description`,`mi`.`price`,`c`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-03 13:08:42
