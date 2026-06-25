-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2026 at 10:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistem_pakar_keracunan`
--

-- --------------------------------------------------------

--
-- Table structure for table `basis_pengetahuan`
--

CREATE TABLE `basis_pengetahuan` (
  `id` int(11) NOT NULL,
  `rule_kode` varchar(5) DEFAULT NULL,
  `aturan_if_then` text DEFAULT NULL,
  `nilai_kepercayaan` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `basis_pengetahuan`
--

INSERT INTO `basis_pengetahuan` (`id`, `rule_kode`, `aturan_if_then`, `nilai_kepercayaan`) VALUES
(1, 'R1', 'IF mual dan muntah (G03) AND kram perut (G04) AND demam tinggi (G05) THEN salmonella', 0.8),
(2, 'R1', 'IF onset lambat (G10) OR diare cair (G01) THEN salmonella', 0.3),
(3, 'R2', 'IF diare berdarah (G02) AND kram perut (G04) AND dehidrasi (G15) THEN e. coli', 0.85),
(4, 'R2', 'IF demam tinggi (G05) OR diare cair (G01) THEN e. coli', 0.4),
(5, 'R3', 'IF diare cair (G01) AND mual dan muntah (G03) AND onset cepat (G09) THEN staphylococcus', 0.8),
(6, 'R3', 'IF kram perut (G04) OR mulut kering (G07) THEN staphylococcus', 0.3),
(7, 'R4', 'IF penglihatan kabur (G06) AND sulit menelan (G08) AND lemas otot (G12) THEN botulisme', 0.95),
(8, 'R4', 'IF mulut kering (G07) OR pusing hebat (G14) THEN botulisme', 0.5),
(9, 'R5', 'IF mual dan muntah (G03) AND onset cepat (G09) AND kram perut (G04) THEN b. cereus', 0.75),
(10, 'R5', 'IF diare cair (G01) OR dehidrasi (G15) THEN b. cereus', 0.3),
(11, 'R6', 'IF diare cair (G01) AND menggigil (G11) AND tinja berlendir (G13) THEN campylobacter', 0.8),
(12, 'R6', 'IF diare berdarah (G02) OR kram perut (G04) THEN campylobacter', 0.5),
(13, 'R7', 'IF pusing hebat (G14) AND mual muntah (G03) AND penglihatan kabur (G06) THEN jamur', 0.85),
(14, 'R7', 'IF onset cepat (G09) OR lemas otot (G12) THEN jamur', 0.4),
(15, 'R8', 'IF demam tinggi (G05) AND lemas otot (G12) AND onset lambat (G10) THEN listeria', 0.8),
(16, 'R8', 'IF menggigil (G11) OR mual muntah (G03) THEN listeria', 0.3),
(17, 'R9', 'IF diare cair (G01) AND mual dan muntah (G03) AND pusing hebat (G14) THEN norovirus', 0.85),
(18, 'R9', 'IF onset cepat (G09) OR dehidrasi (G15) THEN norovirus', 0.4),
(19, 'R10', 'IF diare cair (G01) AND kram perut melilit (G04) AND onset lambat (G10) THEN c. perfringens', 0.75),
(20, 'R10', 'IF nafsu makan hilang (G08) OR badan gemetar (G11) THEN c. perfringens', 0.3),
(21, 'R11', 'IF diare berdarah (G02) AND tinja berlendir (G13) AND tenesmus (G25) THEN shigella', 0.85),
(22, 'R11', 'IF demam tinggi (G05) OR kram perut (G04) THEN shigella', 0.4),
(23, 'R12', 'IF diare cair (G01) AND mual muntah (G03) AND menggigil (G11) THEN vibrio parahaemolyticus', 0.8),
(24, 'R12', 'IF kram perut (G04) OR onset cepat (G09) THEN vibrio parahaemolyticus', 0.4),
(25, 'R13', 'IF kulit kemerahan (G19) AND gatal mulut (G33) AND onset cepat (G09) THEN scombroid toxin', 0.95),
(26, 'R13', 'IF pusing hebat (G14) OR mual muntah (G03) THEN scombroid toxin', 0.4),
(27, 'R14', 'IF suhu terbalik (G17) AND pandangan kabur (G06) AND onset cepat (G09) THEN ciguatoxin', 0.95),
(28, 'R14', 'IF sendi kaku (G30) OR pusing hebat (G14) THEN ciguatoxin', 0.5),
(29, 'R15', 'IF mata/kulit kuning (G16) AND kencing gelap (G31) AND demam tinggi (G05) THEN hepatitis A', 0.9),
(30, 'R15', 'IF lemas otot (G12) OR onset lambat (G10) THEN hepatitis A', 0.4),
(31, 'R16', 'IF feses berminyak (G21) AND kram perut (G04) AND onset lambat (G10) THEN giardia', 0.85),
(32, 'R16', 'IF penurunan berat badan (G35) OR mual (G03) THEN giardia', 0.4),
(33, 'R17', 'IF diare cair (G01) AND mual muntah hebat (G03) AND dehidrasi (G15) THEN rotavirus', 0.8),
(34, 'R17', 'IF demam tinggi (G05) OR onset lambat (G10) THEN rotavirus', 0.3),
(35, 'R18', 'IF nyeri perut kanan bawah (G23) AND diare berdarah (G02) AND demam tinggi (G05) THEN yersinia', 0.85),
(36, 'R18', 'IF onset lambat (G10) OR menggigil (G11) THEN yersinia', 0.4),
(37, 'R19', 'IF diare cair (G01) AND kram perut (G04) AND dehidrasi (G15) THEN cryptosporidium', 0.8),
(38, 'R19', 'IF onset lambat (G10) OR lemas otot (G12) THEN cryptosporidium', 0.3),
(39, 'R20', 'IF perut kembung (G32) AND diare cair (G01) AND onset lambat (G10) THEN cyclospora', 0.8),
(40, 'R20', 'IF nafsu makan hilang (G08) OR pusing (G14) THEN cyclospora', 0.3),
(41, 'R21', 'IF rasa logam di mulut (G18) AND pusing hebat (G14) AND onset cepat (G09) THEN heavy metals', 0.9),
(42, 'R21', 'IF mual muntah (G03) OR penglihatan kabur (G06) THEN heavy metals', 0.5),
(43, 'R22', 'IF air liur berlebih (G22) AND pupil mengecil (G24) AND penglihatan kabur (G06) THEN pesticides', 0.95),
(44, 'R22', 'IF sulit menelan (G08) OR onset cepat (G09) THEN pesticides', 0.5),
(45, 'R23', 'IF pembengkakan sekitar mata (G20) AND nyeri otot (G12) AND demam tinggi (G05) THEN trichinella', 0.85),
(46, 'R23', 'IF kram perut (G04) OR onset lambat (G10) THEN trichinella', 0.3);

-- --------------------------------------------------------

--
-- Table structure for table `gejala`
--

CREATE TABLE `gejala` (
  `kode_gejala` varchar(5) NOT NULL,
  `nama_gejala` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gejala`
--

INSERT INTO `gejala` (`kode_gejala`, `nama_gejala`, `deskripsi`) VALUES
('G01', 'Diare cair (feses encer)', 'Buang air besar dengan konsistensi cair.'),
('G02', 'Diare berdarah', 'Feses yang disertai bercak atau aliran darah.'),
('G03', 'Mual dan muntah hebat', 'Sensasi tidak nyaman diikuti pengeluaran isi lambung.'),
('G04', 'Kram perut atau nyeri tekan', 'Rasa melilit atau nyeri tajam pada area perut.'),
('G05', 'Demam tinggi (>38°C)', 'Peningkatan suhu tubuh akibat infeksi.'),
('G06', 'Penglihatan ganda atau kabur', 'Gangguan visual di mana objek terlihat kabur.'),
('G07', 'Mulut dan tenggorokan sangat kering', 'Rasa haus berlebih akibat dehidrasi.'),
('G08', 'Sulit menelan atau berbicara', 'Gangguan otot tenggorokan saat proses menelan.'),
('G09', 'Gejala muncul cepat (<6 jam)', 'Reaksi mendadak beberapa jam setelah makan.'),
('G10', 'Gejala muncul lambat (>12 jam)', 'Reaksi setelah masa inkubasi bakteri yang lama.'),
('G11', 'Menggigil dan badan gemetar', 'Sensasi dingin disertai kontraksi otot.'),
('G12', 'Lemas otot / kelumpuhan', 'Penurunan fungsi kendali otot secara bertahap.'),
('G13', 'Tinja berlendir', 'Feses diselimuti cairan kental/lendir.'),
('G14', 'Pusing atau vertigo hebat', 'Sensasi ruangan di sekitar berputar.'),
('G15', 'Dehidrasi', 'Kondisi kritis akibat kehilangan banyak cairan.'),
('G16', 'Mata atau kulit menguning (Ikterus)', 'Khas gangguan fungsi hati pada Hepatitis A.'),
('G17', 'Pembalikan sensasi suhu', 'Benda dingin terasa panas dan sebaliknya.'),
('G18', 'Rasa logam di mulut', 'Sensasi besi/logam akibat kontaminasi kimia.'),
('G19', 'Kulit kemerahan dan gatal (Flushing)', 'Reaksi histamin pada keracunan ikan.'),
('G20', 'Pembengkakan di sekitar mata', 'Gejala spesifik infeksi parasit Trichinella.'),
('G21', 'Feses berminyak dan bau busuk', 'Indikasi gangguan penyerapan lemak (Giardia).'),
('G22', 'Air liur berlebih (Sialorea)', 'Sering terjadi pada keracunan pestisida.'),
('G23', 'Nyeri perut kanan bawah', 'Ciri infeksi Yersinia (mirip usus buntu).'),
('G24', 'Pupil mata mengecil (Miosis)', 'Tanda keracunan zat kimia atau pestisida.'),
('G25', 'Sensasi ingin BAB terus (Tenesmus)', 'Sering muncul pada kasus Shigella.'),
('G26', 'Mata terasa panas atau terbakar', 'Menyertai keracunan ikan atau kimia.'),
('G27', 'Ruam kemerahan pada kulit', 'Muncul pada keracunan Vibrio atau Scombroid.'),
('G28', 'Jantung berdebar (Takikardia)', 'Detak jantung sangat cepat.'),
('G29', 'Sesak napas ringan', 'Muncul pada kasus keracunan saraf.'),
('G30', 'Sendi terasa kaku', 'Sering muncul pada infeksi Campylobacter.'),
('G31', 'Air kencing berwarna gelap', 'Tanda dehidrasi berat atau gangguan hati.'),
('G32', 'Perut terasa kembung dan begah', 'Penumpukan gas di perut (Cyclospora).'),
('G33', 'Sensasi gatal di sekitar mulut', 'Muncul setelah makan pemicu alergi/toksin.'),
('G34', 'Gusi berdarah atau bengkak', 'Muncul pada infeksi bakteri invasif.'),
('G35', 'Penurunan berat badan mendadak', 'Terjadi jika diare berlangsung sangat lama.');

-- --------------------------------------------------------

--
-- Table structure for table `penyakit`
--

CREATE TABLE `penyakit` (
  `kode_penyakit` varchar(5) NOT NULL,
  `nama_penyakit` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penyakit`
--

INSERT INTO `penyakit` (`kode_penyakit`, `nama_penyakit`, `deskripsi`) VALUES
('P01', 'Salmonella', 'Infeksi bakteri dari telur atau daging unggas mentah.'),
('P02', 'E. coli', 'Infeksi akibat daging sapi kurang matang atau sayuran mentah.'),
('P03', 'Staphylococcus', 'Keracunan cepat akibat kontaminasi tangan pada makanan.'),
('P04', 'Botulisme', 'Kondisi serius akibat toksin dari makanan kaleng rusak.'),
('P05', 'Bacillus cereus', 'Sering dikaitkan dengan nasi yang dibiarkan lama.'),
('P06', 'Campylobacter', 'Bakteri penyebab diare dari unggas atau air tercemar.'),
('P07', 'Toksin Jamur', 'Gangguan kesehatan akibat racun alami pada jamur liar.'),
('P08', 'Listeria', 'Bakteri dari produk susu atau makanan olahan beku.'),
('P09', 'Norovirus', 'Penyebab muntah dan diare massal yang sangat menular.'),
('P10', 'C. perfringens', 'Sering terjadi pada daging yang dimasak porsi besar.'),
('P11', 'Shigella', 'Menyebabkan diare hebat disertai lendir atau darah.'),
('P12', 'Vibrio parahaemolyticus', 'Infeksi bakteri dari makanan laut mentah.'),
('P13', 'Scombroid Toxin', 'Reaksi histamin tinggi pada ikan yang tidak segar.'),
('P14', 'Ciguatoxin', 'Racun dari ikan karang yang menyerang sistem saraf.'),
('P15', 'Hepatitis A', 'Infeksi virus pada hati melalui makanan tercemar.'),
('P16', 'Giardia', 'Infeksi parasit penyebab diare kronis dan kram.'),
('P17', 'Rotavirus', 'Sering menyerang sistem pencernaan anak-anak.'),
('P18', 'Yersinia', 'Infeksi bakteri dengan gejala mirip radang usus buntu.'),
('P19', 'Cryptosporidium', 'Parasit penyebab diare cair berkepanjangan.'),
('P20', 'Cyclospora', 'Parasit pada buah/sayur segar tercemar.'),
('P21', 'Heavy Metals', 'Kontaminasi logam berat seperti timbal atau merkuri.'),
('P22', 'Pesticides', 'Paparan zat kimia dari produk pertanian.'),
('P23', 'Trichinella', 'Infeksi cacing akibat makan daging babi kurang matang.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `basis_pengetahuan`
--
ALTER TABLE `basis_pengetahuan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gejala`
--
ALTER TABLE `gejala`
  ADD PRIMARY KEY (`kode_gejala`);

--
-- Indexes for table `penyakit`
--
ALTER TABLE `penyakit`
  ADD PRIMARY KEY (`kode_penyakit`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `basis_pengetahuan`
--
ALTER TABLE `basis_pengetahuan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
