[
  RowDataPacket {
    Table: 'users',
    'Create Table': 'CREATE TABLE `users` (\n' +
      '  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
      '  `username` varchar(20) NOT NULL,\n' +
      '  `email` varchar(90) NOT NULL,\n' +
      '  `password` text NOT NULL,\n' +
      '  `is_admin` tinyint(1) NOT NULL DEFAULT 0,\n' +
      '  `last_login` datetime NOT NULL DEFAULT current_timestamp(),\n' +
      '  `created_at` datetime NOT NULL DEFAULT current_timestamp(),\n' +
      '  PRIMARY KEY (`id`)\n' +
      ') ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4'
  }
]
[
  RowDataPacket {
    Table: 'posts',
    'Create Table': 'CREATE TABLE `posts` (\n' +
      '  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
      '  `title` varchar(100) NOT NULL,\n' +
      '  `body` text NOT NULL,\n' +
      '  `posted_by` int(11) NOT NULL,\n' +
      '  `created_at` datetime NOT NULL DEFAULT current_timestamp(),\n' +
      '  PRIMARY KEY (`id`),\n' +
      '  KEY `POST_USER_ID` (`posted_by`),\n' +
      '  CONSTRAINT `POST_USER_ID` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)\n' +
      ') ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4'
  }
]
[
  RowDataPacket {
    Table: 'lessons',
    'Create Table': 'CREATE TABLE `lessons` (\n' +
      '  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
      '  `body` text NOT NULL,\n' +
      '  `file_adress` varchar(100) DEFAULT NULL,\n' +
      '  `posted_by` int(11) NOT NULL,\n' +
      '  `checked_by` int(11) DEFAULT NULL,\n' +
      "  `status` varchar(20) NOT NULL DEFAULT 'CHECKING',\n" +
      '  `created_at` datetime NOT NULL DEFAULT current_timestamp(),\n' +
      '  PRIMARY KEY (`id`),\n' +
      '  KEY `LES_USER_ID` (`posted_by`),\n' +
      '  KEY `LES_ADMIN_ID` (`checked_by`),\n' +
      '  CONSTRAINT `LES_ADMIN_ID` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`),\n' +
      '  CONSTRAINT `LES_USER_ID` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)\n' +
      ') ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4'
  }
]
undefined
[
  RowDataPacket {
    Table: 'posts_comments',
    'Create Table': 'CREATE TABLE `posts_comments` (\n' +
      '  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
      '  `body` text NOT NULL,\n' +
      '  `posted_by` int(11) NOT NULL,\n' +
      '  `post` int(11) NOT NULL,\n' +
      '  `parent_comment` int(11) DEFAULT NULL,\n' +
      '  `created_at` datetime NOT NULL DEFAULT current_timestamp(),\n' +
      '  PRIMARY KEY (`id`),\n' +
      '  KEY `CMT_POST_USER_ID` (`posted_by`),\n' +
      '  KEY `CMT_POST_PARENT_ID` (`parent_comment`),\n' +
      '  KEY `CMT_POST_POST_ID` (`post`),\n' +
      '  CONSTRAINT `CMT_POST_PARENT_ID` FOREIGN KEY (`parent_comment`) REFERENCES `posts_comments` (`id`),\n' +
      '  CONSTRAINT `CMT_POST_POST_ID` FOREIGN KEY (`post`) REFERENCES `posts` (`id`),\n' +
      '  CONSTRAINT `CMT_POST_USER_ID` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)\n' +
      ') ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4'
  }
]
[
  RowDataPacket {
    Table: 'ratings',
    'Create Table': 'CREATE TABLE `ratings` (\n' +
      '  `lesson` int(11) NOT NULL,\n' +
      '  `rating` int(11) NOT NULL,\n' +
      '  `user` int(11) NOT NULL,\n' +
      '  KEY `RAT_USER_ID` (`user`),\n' +
      '  KEY `RAT_LES_ID` (`lesson`),\n' +
      '  CONSTRAINT `RAT_LES_ID` FOREIGN KEY (`lesson`) REFERENCES `lessons` (`id`),\n' +
      '  CONSTRAINT `RAT_USER_ID` FOREIGN KEY (`user`) REFERENCES `users` (`id`)\n' +
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
  }
]
[
  RowDataPacket {
    Table: 'fav_lessons',
    'Create Table': 'CREATE TABLE `fav_lessons` (\n' +
      '  `user_id` int(11) NOT NULL,\n' +
      '  `lesson_id` int(11) NOT NULL,\n' +
      '  KEY `FAV_LES_USER_ID` (`user_id`),\n' +
      '  KEY `FAV_LES_LES_ID` (`lesson_id`),\n' +
      '  CONSTRAINT `FAV_LES_LES_ID` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),\n' +
      '  CONSTRAINT `FAV_LES_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)\n' +
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
  }
]
[
  RowDataPacket {
    Table: 'fav_posts',
    'Create Table': 'CREATE TABLE `fav_posts` (\n' +
      '  `user_id` int(11) NOT NULL,\n' +
      '  `post_id` int(11) NOT NULL,\n' +
      '  KEY `FAV_POST_USER_ID` (`user_id`),\n' +
      '  KEY `FAV_POST_POST_ID` (`post_id`),\n' +
      '  CONSTRAINT `FAV_POST_POST_ID` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),\n' +
      '  CONSTRAINT `FAV_POST_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)\n' +
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
  }
]