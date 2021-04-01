DROP TABLE IF EXISTS users;

 CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      imageUrl VARCHAR(255),
      bio VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      

DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
); 

DROP TABLE IF EXISTS form;

CREATE TABLE form (
    id SERIAL PRIMARY KEY,
    dateStart VARCHAR(255) NOT NULL,
    dateEnd VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

DROP TABLE IF EXISTS plan;

CREATE TABLE plan (
    id SERIAL PRIMARY KEY,
    date VARCHAR(255) NOT NULL,
    toDo VARCHAR(255) NOT NULL,
    toEat VARCHAR(255) NOT NULL,
    ToSleep VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)