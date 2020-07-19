const spicedPg = require("spiced-pg");

let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPw } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPw}@localhost:5432/socialnetwork`);
}

exports.insertUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
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

exports.insertResetCode = (email, code) => {
    return db.query(
        `
        INSERT INTO reset_codes (email, code) VALUES ($1, $2) 
        `,
        [email, code]
    );
};

exports.checkResetCode = (email) => {
    return db.query(
        `
        SELECT * FROM reset_codes
        WHERE email=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        `,
        [email]
    );
};

exports.updatePassword = (email, password) => {
    return db.query(
        `
        UPDATE users SET password=$2
        WHERE email=$1
        `,
        [email, password]
    );
};

exports.updateImage = (id, imageUrl) => {
    return db.query(
        `
        UPDATE users 
        SET imageUrl=$2
        WHERE id=$1
        RETURNING imageUrl
        `,
        [id, imageUrl]
    );
};

exports.updateBio = (id, bio) => {
    return db.query(
        `
        UPDATE users 
        SET bio=$2
        WHERE id=$1
        RETURNING bio
        `,
        [id, bio]
    );
};

exports.recentUsers = () => {
    return db.query(
        `
        SELECT * FROM users ORDER BY id DESC LIMIT 3
        `
    );
};

exports.findUsers = (val) => {
    return db.query(
        `
        SELECT * FROM users 
        WHERE first ILIKE $1
        OR last ILIKE $1;
        `,
        [val + "%"]
    );
};

exports.getInitialStatus = (myId, otherId) => {
    return db.query(
        `
           SELECT * FROM friendships
           WHERE (receiver_id = $1 AND sender_id = $2)
           OR (receiver_id = $2 AND sender_id = $1);
           `,
        [myId, otherId]
    );
};

exports.requestFriend = (myId, otherId) => {
    return db.query(
        `
        INSERT INTO friendships (sender_id, receiver_id ) VALUES ($1, $2)
        `,
        [myId, otherId]
    );
};

// exports.acceptFriend = (myId, otherId) => {
//     return db.query(
//         `
//         UPDATE friendships SET accepted= 'true'
//         WHERE receiver_id = $1 AND sender_id =$2
//         RETURNING *
//         `,
//         [myId, otherId]
//     );
// };

// exports.deleteFriend = (myId, otherId) => {
//     return db.query(
//         `
//         DELETE FROM friendships
//         WHERE (receiver_id = $1 AND sender_id = $2)
//         OR (receiver_id = $2 AND sender_id = $1);
//         `,
//         [myId, otherId]
//     );
// };

exports.getWannabes = (id) => {
    return db.query(
        `SELECT users.id, first, last, url, accepted
            FROM friendships
            JOIN users
            ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
    `,
        [id]
    );
};

exports.acceptFriend = (myId, otherId) => {
    return db.query(
        `UPDATE friendships SET accepted=true WHERE sender_id=$1 AND receiver_id=$2 RETURNING *`,
        [myId, otherId]
    );
};

exports.deleteFriend = (myId, otherId) => {
    return db.query(
        `DELETE FROM friendships WHERE receiver_id = $1 AND sender_id = $2
        OR receiver_id = $2 AND sender_id = $1 RETURNING *`,
        [myId, otherId]
    );
};
