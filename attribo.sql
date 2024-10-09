-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 03 oct. 2024 à 11:15
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `attribo`
--

-- --------------------------------------------------------

--
-- Structure de la table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` varchar(16) NOT NULL,
  `name` varchar(32) NOT NULL,
  `creator_id` varchar(16) NOT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `campaigns`
--

INSERT INTO `campaigns` (`id`, `name`, `creator_id`, `start`, `end`) VALUES
('6gh8jkl8', 'Une petite campagne !', 'abcdef0123456789', NULL, NULL),
('hjkdsjd89', 'Une grande campagne', 'abcdef0123456789', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `options`
--

CREATE TABLE `options` (
  `id` varchar(16) NOT NULL,
  `campaign_id` varchar(16) NOT NULL,
  `name` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `options`
--

INSERT INTO `options` (`id`, `campaign_id`, `name`) VALUES
('1', '6gh8jkl8', 'test'),
('2', '6gh8jkl8', 'caca'),
('3', '6gh8jkl8', 'pipi'),
('4', 'hjkdsjd89', 'prout'),
('5', 'hjkdsjd89', 'basic fit'),
('lukk', '6gh8jkl8', 'une option');

-- --------------------------------------------------------

--
-- Structure de la table `participants`
--

CREATE TABLE `participants` (
  `id` varchar(16) NOT NULL,
  `campaign_id` varchar(16) NOT NULL,
  `name` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `participants`
--

INSERT INTO `participants` (`id`, `campaign_id`, `name`) VALUES
('1', '6gh8jkl8', 'zac boum'),
('10', '6gh8jkl8', 'liam wilson'),
('2', '6gh8jkl8', 'louis ammo'),
('21', 'hjkdsjd89', 'ava walker'),
('22', 'hjkdsjd89', 'noah hall'),
('23', 'hjkdsjd89', 'ella young'),
('24', 'hjkdsjd89', 'logan hernandez'),
('25', 'hjkdsjd89', 'lily king'),
('26', 'hjkdsjd89', 'jackson wright'),
('27', 'hjkdsjd89', 'zoe lopez'),
('28', 'hjkdsjd89', 'levi hill'),
('29', 'hjkdsjd89', 'riley scott'),
('3', '6gh8jkl8', 'emma stone'),
('30', 'hjkdsjd89', 'henry green'),
('4', '6gh8jkl8', 'john doe'),
('5', '6gh8jkl8', 'olivia smith'),
('6', '6gh8jkl8', 'lucas johnson'),
('7', '6gh8jkl8', 'isabella brown'),
('8', '6gh8jkl8', 'mason davis'),
('9', '6gh8jkl8', 'mia miller'),
('un_participant_i', '6gh8jkl8', 'Lucas IMREN');

-- --------------------------------------------------------

--
-- Structure de la table `participant_restrictions`
--

CREATE TABLE `participant_restrictions` (
  `participant_id` varchar(16) NOT NULL,
  `option_id` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `participant_wishes`
--

CREATE TABLE `participant_wishes` (
  `participant_id` varchar(16) NOT NULL,
  `option_id` varchar(16) NOT NULL,
  `rank` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('-19jYe6id1PQqw9rKJT-3swcIn0nhk-D', 1727776670, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T09:57:49.526Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"},\"userId\":\"abcdef0123456789\"}'),
('-59m4BO87QlHzdvvbjUhbyqfFUenJbZC', 1727777288, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:08:07.778Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('6dKyPga7szXh5xZrHTjYyeCIBJfK415U', 1727777408, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:10:07.620Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('GsBX-4lM3Dg_1eReMvgw8aDZhnsqlcod', 1727777489, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:11:28.777Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('H6zHmAYewBrDZ8hIgwsjsOimMu69LVam', 1727776670, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T09:57:50.346Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"},\"userId\":\"abcdef0123456789\"}'),
('Hre06d5B4Mmc5LoJLW4cOkrRs-BD_DKO', 1727777522, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:12:01.529Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('Iplr8PGPQ2AsPuvds4dmUirj4VvBgvd5', 1727777276, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:07:55.748Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('U-pXPVBHwD1E0a54b7w0a143H3ppD-bN', 1727777431, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:10:31.246Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('YyhJ6ADld0uUChjoNxQ5WqAUgl1o1ZbY', 1727777258, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:07:38.143Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('ZAObUqgCKKD0XimK5bYQwGjt4UyNTd18', 1727777135, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:05:35.036Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('aCvvo5hGlUUcwVw-NiKdoMfFIEPgqPa-', 1727777397, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:09:57.390Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('bUynDvhxVcAmDujRqfnHb8jn6qzi1nNi', 1727777301, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:08:21.045Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('gHjkrLm8IOod3z4-EWWBKOngNCmK4W15', 1727775788, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T09:43:08.310Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('h2E3YGGQ4d9P0eDu3ZTPmC9h2pcQ209e', 1727777439, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:10:39.464Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('iVdMZieK7GcINdzEhdOK0QG8AY2facRO', 1727776703, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T09:58:23.256Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"},\"userId\":\"abcdef0123456789\"}'),
('ilzMnrVoPKFiLkvt-wrf6nFUB9R9fRk-', 1727777329, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:08:48.805Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('ll1c6sulqxGTDgtjVjs3S7LQ9tqp7i9z', 1727777651, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:14:11.201Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('m6qHlE8o0tWvHqDIuPIJO_Nh5M9Fmhyv', 1727775834, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T09:43:54.245Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('pSVWmeJ8dT12XeO0-eWDP4txs6WymdSA', 1727776753, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T09:59:13.460Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('phY9XIQYwT1inApqEpx6FZXEzOYO38dG', 1727777630, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:13:50.333Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('rJZnxXSupQkbBmFT85QJXLtUnalHnC0F', 1727777112, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:05:11.630Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('rPJwBFwJREJgGc_Bv1RTRDKTOQCyW2Ay', 1727777647, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:14:07.150Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('uEP1AN80IC5TqyLJm537iQyJQA3q4fGQ', 1727777454, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:10:53.523Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('wnU6bx7nNmxlp9yp_f49ae8vSShjKgm2', 1727775836, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T09:43:56.102Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('xLBjNI6odqSODEX3EQisC-mpxCu1f_md', 1727777240, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:07:19.762Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}'),
('z90hfkKX3tHPoxkyoiN-NHO74zJwt5wW', 1727777625, '{\"cookie\":{\"originalMaxAge\":10000,\"expires\":\"2024-10-01T10:13:45.069Z\",\"secure\":\"false\",\"httpOnly\":false,\"path\":\"/\"}}');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` varchar(16) NOT NULL,
  `username` varchar(32) NOT NULL,
  `hashed_password` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `hashed_password`) VALUES
('abcdef0123456789', 'ifm3r', '$argon2id$v=19$m=65536,t=3,p=4$3gI0rXPvnu6v8nlFVKGv/Q$u/1BOYHy5eA9L78o85d9UOXBIBPw7t5XrDQCWJw6lk4');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- Index pour la table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campaign_id` (`campaign_id`);

--
-- Index pour la table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campaign_id` (`campaign_id`);

--
-- Index pour la table `participant_restrictions`
--
ALTER TABLE `participant_restrictions`
  ADD PRIMARY KEY (`participant_id`,`option_id`),
  ADD KEY `participant_id` (`participant_id`),
  ADD KEY `option_id` (`option_id`);

--
-- Index pour la table `participant_wishes`
--
ALTER TABLE `participant_wishes`
  ADD PRIMARY KEY (`participant_id`,`option_id`),
  ADD KEY `option_id` (`option_id`),
  ADD KEY `participant_id` (`participant_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `campaigns`
--
ALTER TABLE `campaigns`
  ADD CONSTRAINT `campaigns_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `participant_restrictions`
--
ALTER TABLE `participant_restrictions`
  ADD CONSTRAINT `participant_restrictions_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participant_restrictions_ibfk_2` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `participant_wishes`
--
ALTER TABLE `participant_wishes`
  ADD CONSTRAINT `participant_wishes_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participant_wishes_ibfk_2` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
