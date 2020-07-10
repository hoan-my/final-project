///////SERVER run bundle-server.js and index.js

const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
//// bcrypt
const bc = require("./bc.js");
//// database
const db = require("./db.js");
const csurf = require("csurf");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
// s3 images
const s3 = require("./s3");
const { s3Url } = require("./config.json");
// FILE UPLOAD BOILERPLATE (cf. imageboard) //

const multer = require("multer"); // save file to hard drive
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads"); //storing file in /uploads folder
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        }); //uidSafe generates random names
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, //limit saved files
    },
});

app.use(compression());
app.use(
    cookieSession({
        secret: `I eat chocolate everyday`,
        maxAge: 1000 * 60 * 24 * 14,
    })
);
app.use(express.static("./public"));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

//csurf
app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//main node app
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        }) //proxying request
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
////////////////////////////////////

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        /// if the user is logged in...
        res.redirect("/");
    } else {
        /// the user is not logged in
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log(req.body);
    bc.hash(req.body.password)
        .then((hashedPassword) => {
            db.insertUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPassword
            )
                .then((result) => {
                    console.log("result in insertUser:", result);
                    req.session.userId = result.rows[0].id; //HERE
                    res.json(result.rows[0]);
                })
                .catch((err) => {
                    console.log("error in insertUser /register:", err);
                    res.json(error);
                });
        })
        .catch((err) => {
            console.log("error in hash /register:", err);
            res.json(error);
        });
});

//csurf and token
app.post("/login", (req, res) => {
    console.log(req.body);
    db.getUser(req.body.email)
        .then((result) => {
            console.log("result in getUser:", result);
            const user = result.rows[0];
            if (!user) {
                res.render("login", {
                    error: true,
                });
            }
            const storedPassword = user.password;
            bc.compare(password, storedPassword)
                .then((match) => {
                    if (match === true) {
                        const { id, first, last } = user;
                        req.session.user = { id, first, last };
                        res.json("Login is successful");
                    } else {
                        res.json("Login info is incorrect");
                    }
                })
                .catch((err) => {
                    console.log("error in getUser POST/login:", err);
                    res.json(error);
                });
        })
        .catch((err) => {
            console.log("error in hash POST /login:", err);
            res.json(error);
        });
});

app.post("/resetPassword/start", (req, res) => {
    db.getUser(req.body.email)
        .then((result) => {
            console.log("result in /resetPassword/start:", result.rows);
            const registeredEmail = result.rows[0].email;
            if (registeredEmail == req.body.email) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log(secretCode);
                db.insertResetCode(req.body.email, secretCode)
                    .then((result) => {
                        console.log("insertResetCode is running");
                        sendEmail(
                            req.body.email,
                            "Your secret code",
                            `In order to reset your password, please enter your : ${secretCode}`
                        )
                            .then((result) => {
                                res.json("E-mail is sent");
                            })
                            .catch((err) => {
                                console.log("error in sendEmail", err);
                            });
                    })
                    .catch((err) => {
                        console.log("error in inserResetCode", err);
                    });
            }
        })
        .catch((err) => {
            console.log("error in getUser /resetPassword/start:", err);
            res.json({ error: true });
        });
});

app.post("/resetPassword/verify", (req, res) => {
    console.log("resetPassword verify running");
    console.log(req.body);
    let email = req.body.email;
    if (email == "") {
        email = null;
    }
    let changedPassword = req.body.changedPassword;
    if (changedPassword == "") {
        changedPassword = null;
    }
    let resetCode = req.body.resetCode;
    if (resetCode == "") {
        resetCode = null;
    }
    let error = {
        error: true,
    };
    db.checkResetCode(email)
        .then((result) => {
            console.log("email:", email);
            console.log("result from checkResetCode:", result.rows);
            console.log("resetCode", resetCode);
            if (resetCode == result.rows[0].code) {
                bc.hash(changedPassword)
                    .then((hashedPassword) => {
                        db.updatePassword(email, hashedPassword)
                            .then(() => {
                                res.json("update successsful");
                            })
                            .catch((err) => {
                                console.log(
                                    "error in updatePassword /resetPassword/verify:",
                                    err
                                );
                                res.json(error);
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "error in hash /resetPassword/verify:",
                            err
                        );
                        res.json(error);
                    });
            } else {
                res.json(error);
            }
        })
        .catch((err) => {
            console.log("error in checkResetCode /resetPassword/verify:", err);
            res.json(error);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file:", req.file); //req.file is file just uploaded
    console.log("input:", req.body); //req.body is input fields (username, title, description)

    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`; //full url of the file (req.file => filename) + cloud url from aws

    if (filename) {
        return db.updateImage(req.session.userId, imageUrl).then((result) => {
            console.log("result:", result);
            res.json(result.rows[0]);
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/user", (req, res) => {
    console.log(req.session);
    db.getUser(req.session.userId)
        .then((result) => {
            console.log("result GET /user: ", result);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log("Error in GET/user: ", err);
        });
});

app.post("/bio", (req, res) => {
    console.log("req.body in BIO", req.body);
    db.updateBio(req.session.userId, req.body.bio)
        .then((results) => {
            console.log("result POST /bio: ", results);
            if (results.rows[0]) {
                res.json(results.rows[0]);
            } else {
                res.sendStatus(500);
            }
        })
        .catch((err) => {
            console.log("Error POST /bio", err);
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("server is running...");
});
