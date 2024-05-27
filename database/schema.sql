CREATE SCHEMA utopia;
CREATE TABLE utopia.user(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL
    name_first VARHCAR(100) NOT NULL;
    name_last VARCHAR(100) NOT  NULL;
);
CREATE TABLE utopia.contact(
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INTEGER NOT NULL,
    name_first VARCHAR(100) NOT NULL,
    name_last VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, user_id),
    FOREIGN KEY (user_id) REFERENCES utopia.user(id) ON UPDATE CASCADE ON DELETE CASCADE
);