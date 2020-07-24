const spicedPg = require("spiced-pg");

let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPw } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPw}@localhost:5432/trip`);
}

exports.insertUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

exports.insertForm = (dateStart, dateEnd, location) => {
    return db.query(
        `INSERT INTO form (dateStart, dateEnd, location) VALUES ($1, $2, $3) RETURNING id`,
        [dateStart, dateEnd, location]
    );
};

exports.getPlanner = (id) => {
    return db.query(
        `SELECT * FROM form
  WHERE id = $1`,
        [id]
    );
};

exports.getUser = (id) => {
    return db.query(
        `SELECT * FROM users
  WHERE id = $1`,
        [id]
    );
};

exports.getUserLogin = (email) => {
    return db.query(
        `SELECT * FROM users
  WHERE email = $1`,
        [email]
    );
};

exports.getLastTenMsgs = () => {
    return db.query(
        `
        SELECT users.id, chat.id AS message_id, first, last, imageUrl, message, chat.created_at
        FROM chat
        JOIN users ON (sender_id = users.id)
        ORDER BY chat.created_at DESC
        LIMIT 10
        `
    );
};

exports.sendMessage = (msg, myId) => {
    return db.query(
        `
        INSERT INTO chat (message,sender_id) VALUES ($1, $2) RETURNING *
        `,
        [msg, myId]
    );
};

exports.getSenders = (id) => {
    return db.query(
        `
        SELECT users.id, chat.id AS message_id, first, last, imageUrl, message, chat.created_at
        FROM chat
        JOIN users on (sender_id = users.id AND sender_id = $1)
        ORDER BY chat.created_at DESC
        `,
        [id]
    );
};
