-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 13, 2013 at 01:33 AM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sitoko`
--
CREATE DATABASE `sitoko` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `sitoko`;

-- --------------------------------------------------------

--
-- Table structure for table `item_sale_prices`
--

CREATE TABLE IF NOT EXISTS `item_sale_prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `item_unit_type_id` int(11) NOT NULL,
  `jenis_penjualan` enum('KULAKAN','ECERAN') NOT NULL,
  `harga_per_satuan` decimal(11,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_id` (`item_id`,`item_unit_type_id`,`jenis_penjualan`),
  KEY `item_unit_type_id` (`item_unit_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=27 ;

--
-- Dumping data for table `item_sale_prices`
--

INSERT INTO `item_sale_prices` (`id`, `item_id`, `item_unit_type_id`, `jenis_penjualan`, `harga_per_satuan`) VALUES
(1, 1, 1, 'ECERAN', 7800.00),
(2, 1, 1, 'KULAKAN', 7600.00),
(3, 1, 2, 'KULAKAN', 75700.00),
(4, 2, 1, 'ECERAN', 10000.00),
(5, 2, 1, 'KULAKAN', 9900.00),
(6, 2, 2, 'KULAKAN', 98800.00),
(7, 3, 1, 'ECERAN', 5500.00),
(8, 3, 1, 'KULAKAN', 5300.00),
(9, 3, 2, 'KULAKAN', 52500.00),
(10, 4, 1, 'ECERAN', 7200.00),
(11, 4, 1, 'KULAKAN', 7000.00),
(12, 4, 2, 'KULAKAN', 69500.00),
(26, 81, 1, 'KULAKAN', 1600.00);

-- --------------------------------------------------------

--
-- Table structure for table `item_unit_types`
--

CREATE TABLE IF NOT EXISTS `item_unit_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `item_unit_types`
--

INSERT INTO `item_unit_types` (`id`, `nama`) VALUES
(1, 'bungkus'),
(2, 'pak'),
(3, 'dus'),
(5, 'renteng'),
(6, 'lusin');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `stok` int(11) DEFAULT NULL,
  `item_category_id` int(11) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama_2` (`nama`),
  UNIQUE KEY `barcode` (`barcode`),
  KEY `nama` (`nama`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=136 ;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `nama`, `stok`, `item_category_id`, `barcode`) VALUES
(1, 'Djarum Super 12', NULL, NULL, NULL),
(2, 'Djarum Super 16', NULL, NULL, NULL),
(3, 'Djarum 76 12', NULL, NULL, NULL),
(4, 'Djarum 76 16', NULL, NULL, NULL),
(5, 'Djarum Black', NULL, NULL, NULL),
(6, 'Djarum Black Menthol', NULL, NULL, NULL),
(7, 'Djarum Black Tea', NULL, NULL, NULL),
(8, 'Djarum Black Capuccino', NULL, NULL, NULL),
(9, 'Djarum Black Slimz', NULL, NULL, NULL),
(10, 'L.A. Merah 12', NULL, NULL, NULL),
(11, 'L.A. Merah 16', NULL, NULL, NULL),
(12, 'L.A. Menthol 12', NULL, NULL, NULL),
(13, 'L.A. Menthol 16', NULL, NULL, NULL),
(14, 'Tanjung 10', NULL, NULL, NULL),
(15, 'Tanjung 12', NULL, NULL, NULL),
(16, 'Sampoerna Mild 12', NULL, NULL, NULL),
(17, 'Sampoerna Mild 16', NULL, NULL, NULL),
(18, 'Sampoerna Kretek', NULL, NULL, NULL),
(19, 'Sampoerna Hijau', NULL, NULL, NULL),
(20, 'Dji Sam Soe Kretek 12', NULL, NULL, NULL),
(21, 'Dji Sam Soe Kretek 16', NULL, NULL, NULL),
(22, 'Dji Sam Soe Filter', NULL, NULL, NULL),
(23, 'Dji Sam Soe Refill', NULL, NULL, NULL),
(24, 'Dji Sam Soe Magnum', NULL, NULL, NULL),
(25, 'Dji Sam Soe Gold', NULL, NULL, NULL),
(26, 'Marlboro Merah', NULL, NULL, NULL),
(27, 'Marlboro Menthol', NULL, NULL, NULL),
(28, 'Marlboro Lights', NULL, NULL, NULL),
(29, 'Marlboro Light Menthol', NULL, NULL, NULL),
(30, 'Marlboro Black Menthol', NULL, NULL, NULL),
(31, 'Marlboro Classic', NULL, NULL, NULL),
(32, 'Kraton', NULL, NULL, NULL),
(33, 'Gudang Garam Filter 12', NULL, NULL, NULL),
(34, 'Gundang Garam Kretek 12', NULL, NULL, NULL),
(35, 'Gudang Garam Kretek 16', NULL, NULL, NULL),
(36, 'Gudang Garam Surya 12', NULL, NULL, NULL),
(37, 'Gudang Garam Surya 16', NULL, NULL, NULL),
(38, 'Surya Pro', NULL, NULL, NULL),
(39, 'Surya Slim 12', NULL, NULL, NULL),
(40, 'Surya Slim 16', NULL, NULL, NULL),
(41, 'Gudang Garam Djaja Lama', NULL, NULL, NULL),
(42, 'Gudang Garam Djaja Baru', NULL, NULL, NULL),
(43, 'Bentoel', NULL, NULL, NULL),
(44, 'Bentoel Sejati', NULL, NULL, NULL),
(45, 'Bintang Buana Filter', NULL, NULL, NULL),
(46, 'Bintang Buana Kretek', NULL, NULL, NULL),
(47, 'Kansas', NULL, NULL, NULL),
(48, 'Ardath', NULL, NULL, NULL),
(49, 'Lucky Strike', NULL, NULL, NULL),
(50, 'Dunhill', NULL, NULL, NULL),
(51, 'Wimilak Diplomat', NULL, NULL, NULL),
(52, 'Wismilak Kretek', NULL, NULL, NULL),
(53, 'Wismilak Slim', NULL, NULL, NULL),
(54, 'Pall Mall Merah', NULL, NULL, NULL),
(55, 'Pall Mall Hijau', NULL, NULL, NULL),
(56, 'Pall Mall Biru', NULL, NULL, NULL),
(57, 'Country', NULL, NULL, NULL),
(58, 'Brown', NULL, NULL, NULL),
(59, 'Sukun Kretek', NULL, NULL, NULL),
(60, 'Sukun Filter', NULL, NULL, NULL),
(61, 'Lodjie', NULL, NULL, NULL),
(62, 'Rindang Filter', NULL, NULL, NULL),
(63, 'Rindang Kretek', NULL, NULL, NULL),
(64, 'Djeruk Filter', NULL, NULL, NULL),
(65, 'Djeruk Kretek', NULL, NULL, NULL),
(66, 'Clas Mild', NULL, NULL, NULL),
(67, 'Star Mild', NULL, NULL, NULL),
(68, 'U Mild', NULL, NULL, NULL),
(69, 'Garuda', NULL, NULL, NULL),
(70, 'Gula Pasir', NULL, NULL, NULL),
(71, 'Minyak Sawit', NULL, NULL, NULL),
(72, 'Minyak Barco', NULL, NULL, NULL),
(73, 'Telur', NULL, NULL, NULL),
(74, 'Gandum Biasa', NULL, NULL, NULL),
(75, 'Gandum Cakra', NULL, NULL, NULL),
(76, 'Kanji', NULL, NULL, NULL),
(77, 'Tepung Beras', NULL, NULL, NULL),
(78, 'Minyak Hemart', NULL, NULL, NULL),
(79, 'Bawang Merah', NULL, NULL, NULL),
(80, 'Bawang Putih', NULL, NULL, NULL),
(81, 'Indomie Goreng', NULL, NULL, NULL),
(82, 'Indomie Ayam Spesial', NULL, NULL, NULL),
(83, 'Indomie Ayam Bawang', NULL, NULL, NULL),
(84, 'Indomie Soto', NULL, NULL, NULL),
(85, 'Sarimi Ayam', NULL, NULL, NULL),
(86, 'Sarimi Ayam Bawang', NULL, NULL, NULL),
(87, 'Sarimi Soto', NULL, NULL, NULL),
(88, 'Selera Pedas Gulai Ayam', NULL, NULL, NULL),
(89, 'Selera Pedas Sop Tomat', NULL, NULL, NULL),
(90, 'Supermi', NULL, NULL, NULL),
(91, 'Sedap Goreng', NULL, NULL, NULL),
(92, 'Sedap Ayam', NULL, NULL, NULL),
(93, 'Sedap Ayam Bawang', NULL, NULL, NULL),
(94, 'Sedap Soto', NULL, NULL, NULL),
(95, 'Aqua Gelas', NULL, NULL, NULL),
(96, 'Aqua Tanggung', NULL, NULL, NULL),
(97, 'Aqua Besar', NULL, NULL, NULL),
(98, 'Mizone', NULL, NULL, NULL),
(99, 'Vitazone', NULL, NULL, NULL),
(100, 'Sprite Kaleng', NULL, NULL, NULL),
(101, 'Coca-cola Kaleng', NULL, NULL, NULL),
(102, 'Fanta Kaleng', NULL, NULL, NULL),
(103, 'Sprite Botol', NULL, NULL, NULL),
(104, 'Coca-cola Botol', NULL, NULL, NULL),
(105, 'Fanta Botol', NULL, NULL, NULL),
(106, 'Kratingdaeng', NULL, NULL, NULL),
(107, 'Extra Joss', NULL, NULL, NULL),
(108, 'Kuku Bima Energi', NULL, NULL, NULL),
(109, 'Hemaviton', NULL, NULL, NULL),
(110, 'Adem Sari', NULL, NULL, NULL),
(111, 'Vegeta', NULL, NULL, NULL),
(112, 'Sabun Lifeboy', NULL, NULL, NULL),
(113, 'Lux', NULL, NULL, NULL),
(114, 'Giv', NULL, NULL, NULL),
(115, 'Nuvo', NULL, NULL, NULL),
(116, 'Cusson', NULL, NULL, NULL),
(117, 'Cusson Baby', NULL, NULL, NULL),
(118, 'Fresh', NULL, NULL, NULL),
(119, 'Pantene Sachet', NULL, NULL, NULL),
(120, 'Clear Sachet', NULL, NULL, NULL),
(121, 'Rejoice Sachet', NULL, NULL, NULL),
(122, 'Shampo Lifeboy Sachet', NULL, NULL, NULL),
(123, 'Dove', NULL, NULL, NULL),
(124, 'SunSilk Sachet', NULL, NULL, NULL),
(125, 'Supermi Ayam Bawang', NULL, NULL, NULL),
(126, 'Selera Pedas', NULL, NULL, NULL),
(134, 'Rinso Kecil', NULL, NULL, NULL),
(135, 'Rinso 1 kg', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_details`
--

CREATE TABLE IF NOT EXISTS `sale_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sale_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `jumlah_barang` int(11) NOT NULL,
  `item_unit_type_id` int(11) NOT NULL,
  `harga` decimal(11,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sale_id` (`sale_id`,`item_id`),
  KEY `item_id` (`item_id`),
  KEY `item_unit_type_id` (`item_unit_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=102 ;

--
-- Dumping data for table `sale_details`
--

INSERT INTO `sale_details` (`id`, `sale_id`, `item_id`, `jumlah_barang`, `item_unit_type_id`, `harga`) VALUES
(42, 1, 1, 1, 1, 7600.00),
(43, 1, 2, 1, 1, 9900.00),
(44, 2, 3, 1, 2, 52500.00),
(45, 2, 4, 5, 1, 7000.00),
(46, 2, 1, 1, 2, 75700.00),
(47, 2, 2, 5, 1, 9900.00),
(48, 3, 3, 1, 2, 52500.00),
(49, 3, 4, 5, 1, 7000.00),
(50, 3, 1, 1, 2, 75700.00),
(51, 3, 2, 5, 1, 9900.00),
(52, 4, 1, 1, 2, 75700.00),
(53, 4, 2, 5, 1, 9900.00),
(54, 5, 1, 1, 2, 75700.00),
(55, 5, 2, 5, 1, 9900.00),
(56, 6, 1, 1, 2, 75700.00),
(57, 6, 3, 1, 2, 52500.00),
(58, 7, 3, 1, 2, 52500.00),
(59, 7, 4, 1, 2, 69500.00),
(60, 8, 1, 1, 2, 75700.00),
(61, 8, 2, 1, 2, 98800.00),
(62, 9, 1, 1, 2, 75700.00),
(63, 9, 3, 1, 2, 52500.00),
(64, 9, 4, 1, 2, 69500.00),
(65, 9, 2, 1, 2, 98800.00),
(66, 10, 4, 1, 2, 69500.00),
(67, 10, 2, 1, 2, 98800.00),
(68, 11, 1, 1, 1, 7800.00),
(72, 14, 1, 5, 1, 7600.00),
(73, 14, 2, 1, 1, 9900.00),
(74, 15, 3, 1, 2, 52500.00),
(75, 15, 4, 1, 2, 69500.00),
(76, 15, 1, 1, 2, 75700.00),
(77, 15, 2, 1, 2, 98800.00),
(78, 16, 1, 1, 2, 75700.00),
(79, 16, 2, 5, 1, 9900.00),
(80, 17, 1, 1, 2, 75700.00),
(81, 17, 2, 5, 2, 98800.00),
(82, 17, 3, 1, 2, 52500.00),
(83, 17, 4, 5, 1, 7000.00),
(84, 18, 3, 1, 1, 5300.00),
(85, 19, 3, 1, 1, 5300.00),
(86, 20, 3, 2, 2, 52500.00),
(87, 20, 1, 2, 2, 75700.00),
(88, 21, 3, 1, 1, 5300.00),
(91, 23, 3, 1, 1, 5300.00),
(94, 25, 1, 1, 1, 7600.00),
(95, 25, 3, 1, 1, 5300.00),
(96, 26, 1, 1, 1, 7800.00),
(97, 26, 3, 1, 1, 5500.00),
(98, 26, 81, 1, 1, 1500.00),
(99, 27, 1, 1, 1, 7800.00),
(100, 27, 3, 1, 1, 5500.00),
(101, 27, 81, 1, 1, 2000.00);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE IF NOT EXISTS `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `waktu` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `costumer_id` int(11) DEFAULT NULL,
  `jenis_penjualan` enum('KULAKAN','ECERAN') NOT NULL,
  `harga_total` decimal(11,2) NOT NULL,
  `pembayaran` decimal(11,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `waktu`, `costumer_id`, `jenis_penjualan`, `harga_total`, `pembayaran`) VALUES
(1, '2010-02-11 05:58:47', NULL, 'KULAKAN', 17500.00, 0.00),
(2, '2010-02-11 06:03:14', NULL, 'KULAKAN', 212700.00, 0.00),
(3, '2010-02-11 09:35:08', NULL, 'KULAKAN', 212700.00, 250000.00),
(4, '2010-02-11 09:38:57', NULL, 'KULAKAN', 125200.00, 150000.00),
(5, '2010-02-11 09:41:22', NULL, 'KULAKAN', 125200.00, 150000.00),
(6, '2010-02-11 09:43:11', NULL, 'KULAKAN', 128200.00, NULL),
(7, '2010-02-11 09:53:45', NULL, 'KULAKAN', 122000.00, NULL),
(8, '2010-02-11 09:55:00', NULL, 'KULAKAN', 174500.00, NULL),
(9, '2010-02-11 10:04:30', NULL, 'KULAKAN', 296500.00, NULL),
(10, '2010-02-11 10:05:18', NULL, 'KULAKAN', 168300.00, NULL),
(11, '2010-02-12 10:16:51', NULL, 'ECERAN', 7800.00, NULL),
(14, '2010-03-02 09:53:11', NULL, 'KULAKAN', 47900.00, NULL),
(15, '2010-03-05 10:43:36', NULL, 'KULAKAN', 296500.00, NULL),
(16, '2010-03-05 10:44:14', NULL, 'KULAKAN', 125200.00, NULL),
(17, '2010-03-21 05:18:07', NULL, 'KULAKAN', 657200.00, 700000.00),
(18, '2013-08-18 03:00:03', NULL, 'KULAKAN', 5300.00, NULL),
(19, '2013-08-19 03:09:02', NULL, 'KULAKAN', 5300.00, NULL),
(20, '2013-08-21 12:18:28', NULL, 'KULAKAN', 256400.00, 300000.00),
(21, '2013-08-23 11:30:04', NULL, 'KULAKAN', 5300.00, 10000.00),
(23, '2013-08-26 16:22:43', NULL, 'KULAKAN', 5300.00, 20000.00),
(25, '2013-09-12 22:12:04', NULL, 'KULAKAN', 12900.00, NULL),
(26, '2013-09-12 22:19:40', NULL, 'ECERAN', 14800.00, 15000.00),
(27, '2013-09-12 23:31:02', NULL, 'ECERAN', 15300.00, 20000.00);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item_sale_prices`
--
ALTER TABLE `item_sale_prices`
  ADD CONSTRAINT `item_sale_prices_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `item_sale_prices_ibfk_2` FOREIGN KEY (`item_unit_type_id`) REFERENCES `item_unit_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sale_details`
--
ALTER TABLE `sale_details`
  ADD CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sale_details_ibfk_4` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `sale_details_ibfk_5` FOREIGN KEY (`item_unit_type_id`) REFERENCES `item_unit_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
