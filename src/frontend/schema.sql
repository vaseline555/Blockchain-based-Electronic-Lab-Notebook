drop table if exists user;

create table user
(
  id integer primary key autoincrement,
  nickname text not null,
  email text not null,
  password text not null,
  timestamp INTEGER not null,
  role text not null
);

drop table if exists post;

create table post
(
  id integer primary key autoincrement,
  title text not null,
  body text not null,
  timestamp INTEGER not null,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES user(id)
);

drop table if exists reply;

create table reply
(
  id integer primary key autoincrement,
  content text not null,
  timestamp INTEGER not null,
  post_id INTEGER,
  user_id INTEGER,
  FOREIGN KEY(post_id) REFERENCES post(id)
  FOREIGN KEY(user_id) REFERENCES user(id)
);