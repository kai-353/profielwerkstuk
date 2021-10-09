CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(20) NOT NULL,
    `email` varchar(90) NOT NULL,
    `password` text NOT NULL,
    `is_admin` tinyint(1) NOT NULL DEFAULT 0,
    `last_login` datetime NOT NULL DEFAULT current_timestamp(),
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4

CREATE TABLE `posts` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `title` varchar(100) NOT NULL,
        `body` text NOT NULL,
        `posted_by` int(11) NOT NULL,
        `created_at` datetime NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `POST_USER_ID` (`posted_by`),
        CONSTRAINT `POST_USER_ID` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4

CREATE TABLE `lessons` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `body` text NOT NULL,
        `file_adress` varchar(100) DEFAULT NULL,
        `posted_by` int(11) NOT NULL,
        `checked_by` int(11) DEFAULT NULL,
        `status` varchar(20) NOT NULL DEFAULT 'CHECKING',
        `created_at` datetime NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `LES_USER_ID` (`posted_by`),
        KEY `LES_ADMIN_ID` (`checked_by`),
        CONSTRAINT `LES_ADMIN_ID` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`),
        CONSTRAINT `LES_USER_ID` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
      ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4

CREATE TABLE `posts_comments` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `body` text NOT NULL,
        `posted_by` int(11) NOT NULL,
        `post` int(11) NOT NULL,
        `parent_comment` int(11) DEFAULT NULL,
        `created_at` datetime NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `CMT_POST_USER_ID` (`posted_by`),
        KEY `CMT_POST_PARENT_ID` (`parent_comment`),
        KEY `CMT_POST_POST_ID` (`post`),
        CONSTRAINT `CMT_POST_PARENT_ID` FOREIGN KEY (`parent_comment`) REFERENCES `posts_comments` (`id`),
        CONSTRAINT `CMT_POST_POST_ID` FOREIGN KEY (`post`) REFERENCES `posts` (`id`),
        CONSTRAINT `CMT_POST_USER_ID` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
      ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4

CREATE TABLE `ratings` (
        `lesson` int(11) NOT NULL,
        `rating` int(11) NOT NULL,
        `user` int(11) NOT NULL,
        KEY `RAT_USER_ID` (`user`),
        KEY `RAT_LES_ID` (`lesson`),
        CONSTRAINT `RAT_LES_ID` FOREIGN KEY (`lesson`) REFERENCES `lessons` (`id`),
        CONSTRAINT `RAT_USER_ID` FOREIGN KEY (`user`) REFERENCES `users` (`id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

CREATE TABLE `fav_lessons` (
        `user_id` int(11) NOT NULL,
        `lesson_id` int(11) NOT NULL,
        KEY `FAV_LES_USER_ID` (`user_id`),
        KEY `FAV_LES_LES_ID` (`lesson_id`),
        CONSTRAINT `FAV_LES_LES_ID` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),
        CONSTRAINT `FAV_LES_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

CREATE TABLE `fav_posts` (
        `user_id` int(11) NOT NULL,
        `post_id` int(11) NOT NULL,
        KEY `FAV_POST_USER_ID` (`user_id`),
        KEY `FAV_POST_POST_ID` (`post_id`),
        CONSTRAINT `FAV_POST_POST_ID` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
        CONSTRAINT `FAV_POST_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4