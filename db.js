const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPw } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPw}@localhost:5432/imageboard`);
}
