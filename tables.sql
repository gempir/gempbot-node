CREATE TABLE trusted
(
    id int PRIMARY KEY AUTO_INCREMENT,
    username text
);

CREATE TABLE config
(
    id int PRIMARY KEY AUTO_INCREMENT,
    globalcooldown text,
    whispercooldown text
);

INSERT INTO config (globalcooldown, whispercooldown) VALUES (6000, 50);
