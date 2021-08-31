-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 21, 2021 at 02:29 AM
-- Server version: 8.0.23
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cheva_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `chapter`
--

CREATE TABLE `chapter` (
  `id` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `content` text,
  `course_chapter_id` int NOT NULL,
  `link_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` timestamp NOT NULL,
  `media_id` int NOT NULL,
  `mentor_id` int NOT NULL,
  `div_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `course_chapter`
--

CREATE TABLE `course_chapter` (
  `id` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `course_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `course_glossary`
--

CREATE TABLE `course_glossary` (
  `id` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `course_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `course_progress`
--

CREATE TABLE `course_progress` (
  `id` int NOT NULL,
  `course_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `section_id` int NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `div`
--

CREATE TABLE `div` (
  `id` int NOT NULL,
  `name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `div`
--

INSERT INTO `div` (`id`, `name`) VALUES
(1, 'web'),
(2, 'android'),
(3, 'game'),
(4, 'ui/ux');

-- --------------------------------------------------------

--
-- Table structure for table `link`
--

CREATE TABLE `link` (
  `id` bigint NOT NULL,
  `uri` varchar(255) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` bigint NOT NULL,
  `label` varchar(128) NOT NULL,
  `uri` varchar(255) DEFAULT NULL,
  `created_at` date NOT NULL,
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `presence`
--

CREATE TABLE `presence` (
  `id` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `studygroup_id` int NOT NULL,
  `student_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_answer`
--

CREATE TABLE `quiz_answer` (
  `id` int NOT NULL,
  `quiz_option_id` int NOT NULL,
  `task_student_id` int NOT NULL,
  `quiz_question_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_option`
--

CREATE TABLE `quiz_option` (
  `id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  `is_true` tinyint NOT NULL DEFAULT '0',
  `quiz_question_id` int NOT NULL,
  `media_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_question`
--

CREATE TABLE `quiz_question` (
  `id` int NOT NULL,
  `question` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `task_id` int NOT NULL,
  `media_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'mentor'),
(2, 'student'),
(3, 'guest'),
(4, 'alumni'),
(5, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` int NOT NULL,
  `value` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `value`) VALUES
(1, 'uncompleted '),
(2, 'checking '),
(3, 'done '),
(4, 'expired');

-- --------------------------------------------------------

--
-- Table structure for table `student_assignment`
--

CREATE TABLE `student_assignment` (
  `id` int NOT NULL,
  `task_student_id` int NOT NULL,
  `link_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `studygroup`
--

CREATE TABLE `studygroup` (
  `id` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `media_id` int NOT NULL,
  `meet_id` int DEFAULT NULL,
  `video_id` int DEFAULT NULL,
  `mentor_id` int NOT NULL,
  `div_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` enum('quiz','assignment') NOT NULL,
  `deadline` timestamp NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` timestamp NOT NULL,
  `media_id` int NOT NULL,
  `mentor_id` int NOT NULL,
  `div_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `task_helper`
--

CREATE TABLE `task_helper` (
  `id` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `task_id` int NOT NULL,
  `link_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `task_student`
--

CREATE TABLE `task_student` (
  `id` int NOT NULL,
  `score` int DEFAULT NULL,
  `status_id` int NOT NULL DEFAULT '1',
  `task_id` int NOT NULL,
  `student_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `div_id` int NOT NULL,
  `role_id` int NOT NULL,
  `media_id` int DEFAULT NULL,
  `created_at` date NOT NULL,
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chapter`
--
ALTER TABLE `chapter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapter_course_chapter_id_fk` (`course_chapter_id`),
  ADD KEY `chapter_link_id_fk` (`link_id`);
  
--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile_media_id_fk` (`media_id`),
  ADD KEY `profile_role_id_fk` (`role_id`),
  ADD KEY `profile_div_id_fk` (`div_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_division_id_fk` (`div_id`),
  ADD KEY `course_media_id_fk` (`media_id`),
  ADD KEY `course_user_id_fk` (`mentor_id`);

--
-- Indexes for table `course_chapter`
--
ALTER TABLE `course_chapter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_chapter_course_id_fk` (`course_id`);

--
-- Indexes for table `course_glossary`
--
ALTER TABLE `course_glossary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_glossary_course_id_fk` (`course_id`);

--
-- Indexes for table `course_progress`
--
ALTER TABLE `course_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_progress_chapter_id_fk` (`chapter_id`),
  ADD KEY `course_progress_course_chapter_id_fk` (`course_id`),
  ADD KEY `course_progress_course_id_fk` (`section_id`),
  ADD KEY `course_progress_user_id_fk` (`user_id`);

--
-- Indexes for table `div`
--
ALTER TABLE `div`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `link`
--
ALTER TABLE `link`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `presence`
--
ALTER TABLE `presence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `presence_studygroup_id_fk` (`studygroup_id`),
  ADD KEY `presence_user_id_fk` (`student_id`);

--
-- Indexes for table `quiz_answer`
--
ALTER TABLE `quiz_answer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_answer_quiz_question_id_fk` (`quiz_question_id`),
  ADD KEY `quiz_answer_task_student_id_fk` (`task_student_id`),
  ADD KEY `quiz_answer_question_option_id_fk` (`quiz_option_id`);

--
-- Indexes for table `quiz_option`
--
ALTER TABLE `quiz_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_option_quiz_question_id_fk` (`quiz_question_id`),
  ADD KEY `question_option_media_id_fk` (`media_id`);

--
-- Indexes for table `quiz_question`
--
ALTER TABLE `quiz_question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_question_media_id_fk` (`media_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_assignment`
--
ALTER TABLE `student_assignment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_assignment_id_uindex` (`id`),
  ADD KEY `student_assignment_link_id_fk` (`link_id`),
  ADD KEY `student_assignment_task_student_id_fk` (`task_student_id`);

--
-- Indexes for table `studygroup`
--
ALTER TABLE `studygroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studygroup_media_id_fk` (`media_id`),
  ADD KEY `studygroup_division_id_fk` (`div_id`),
  ADD KEY `studygroup_user_id_fk` (`mentor_id`),
  ADD KEY `studygroup_link_id_fk` (`video_id`),
  ADD KEY `studygroup_link_id_fk2` (`meet_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_division_id_fk` (`div_id`),
  ADD KEY `task_media_id_fk` (`media_id`),
  ADD KEY `task_user_id_fk` (`mentor_id`);

--
-- Indexes for table `task_helper`
--
ALTER TABLE `task_helper`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_helper_link_id_fk` (`link_id`),
  ADD KEY `task_helper_task_id_fk` (`task_id`);

--
-- Indexes for table `task_student`
--
ALTER TABLE `task_student`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_student_user_id_fk` (`student_id`),
  ADD KEY `task_student_status_id_fk_idx` (`status_id`),
  ADD KEY `task_student_task_id_fk` (`task_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_username_uindex` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chapter`
--
ALTER TABLE `chapter`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_chapter`
--
ALTER TABLE `course_chapter`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_glossary`
--
ALTER TABLE `course_glossary`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_progress`
--
ALTER TABLE `course_progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `div`
--
ALTER TABLE `div`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `link`
--
ALTER TABLE `link`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `presence`
--
ALTER TABLE `presence`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_answer`
--
ALTER TABLE `quiz_answer`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_option`
--
ALTER TABLE `quiz_option`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_assignment`
--
ALTER TABLE `student_assignment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studygroup`
--
ALTER TABLE `studygroup`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_helper`
--
ALTER TABLE `task_helper`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_student`
--
ALTER TABLE `task_student`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chapter`
--
ALTER TABLE `chapter`
  ADD CONSTRAINT `chapter_course_chapter_id_fk` FOREIGN KEY (`course_chapter_id`) REFERENCES `course_chapter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chapter_link_id_fk` FOREIGN KEY (`link_id`) REFERENCES `link` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_division_id_fk` FOREIGN KEY (`div_id`) REFERENCES `div` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_user_id_fk` FOREIGN KEY (`mentor_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course_chapter`
--
ALTER TABLE `course_chapter`
  ADD CONSTRAINT `course_chapter_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course_glossary`
--
ALTER TABLE `course_glossary`
  ADD CONSTRAINT `course_glossary_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course_progress`
--
ALTER TABLE `course_progress`
  ADD CONSTRAINT `course_progress_course_chapter_id_fk` FOREIGN KEY (`chapter_id`) REFERENCES `course_chapter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_progress_chapter_id_fk` FOREIGN KEY (`section_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_progress_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_progress_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
  
--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_user_id_fk` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profile_div_id_fk` FOREIGN KEY (`div_id`) REFERENCES `div` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `presence`
--
ALTER TABLE `presence`
  ADD CONSTRAINT `presence_studygroup_id_fk` FOREIGN KEY (`studygroup_id`) REFERENCES `studygroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `presence_user_id_fk` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz_answer`
--
ALTER TABLE `quiz_answer`
  ADD CONSTRAINT `quiz_answer_question_option_id_fk` FOREIGN KEY (`quiz_option_id`) REFERENCES `quiz_option` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quiz_answer_quiz_question_id_fk` FOREIGN KEY (`quiz_question_id`) REFERENCES `quiz_question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quiz_answer_task_student_id_fk` FOREIGN KEY (`task_student_id`) REFERENCES `task_student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz_option`
--
ALTER TABLE `quiz_option`
  ADD CONSTRAINT `question_option_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `question_option_quiz_question_id_fk` FOREIGN KEY (`quiz_question_id`) REFERENCES `quiz_question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz_question`
--
ALTER TABLE `quiz_question`
  ADD CONSTRAINT `quiz_question_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quiz_question_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_assignment`
--
ALTER TABLE `student_assignment`
  ADD CONSTRAINT `student_assignment_link_id_fk` FOREIGN KEY (`link_id`) REFERENCES `link` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_assignment_task_student_id_fk` FOREIGN KEY (`task_student_id`) REFERENCES `task_student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studygroup`
--
ALTER TABLE `studygroup`
  ADD CONSTRAINT `studygroup_division_id_fk` FOREIGN KEY (`div_id`) REFERENCES `div` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studygroup_link_id_fk` FOREIGN KEY (`video_id`) REFERENCES `link` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studygroup_link_id_fk2` FOREIGN KEY (`meet_id`) REFERENCES `link` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studygroup_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studygroup_user_id_fk` FOREIGN KEY (`mentor_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_division_id_fk` FOREIGN KEY (`div_id`) REFERENCES `div` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_user_id_fk` FOREIGN KEY (`mentor_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task_helper`
--
ALTER TABLE `task_helper`
  ADD CONSTRAINT `task_helper_link_id_fk` FOREIGN KEY (`link_id`) REFERENCES `link` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_helper_task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task_student`
--
ALTER TABLE `task_student`
  ADD CONSTRAINT `task_student_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_student_task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_student_user_id_fk` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
