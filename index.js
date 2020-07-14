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
    db.getUserLogin(req.body.email)
        .then((result) => {
            console.log("result in getUserLogin:", result);
            const user = result.rows[0];
            if (!user) {
                res.render("login", {
                    error: true,
                });
            }
            const storedPassword = user.password;
            bc.compare(req.body.password, storedPassword)
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
                    console.log("error in getUserLogin POST/login:", err);
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

app.get("/user/:id.json", (req, res) => {
    if (req.session.userId == req.params.id) {
        res.json({ match: true });
    }
    db.getUser(req.params.id)
        .then((result) => {
            console.log("result GET /user/id :", result);
            res.json({
                first: result.rows[0].first,
                last: result.rows[0].last,
                profilePic: result.rows[0].imageUrl,
                bio: result.rows[0].bio,
                id: result.rows[0].id,
            });
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log("Error GET /user/id :", err);
        });
});

app.get("/users", (req, res) => {
    db.recentUsers()
        .then((result) => {
            console.log("result GET/users: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error GET/users : ", err);
        });
});

app.get("/results/:search.json", (req, res) => {
    db.findUsers(req.params.search)
        .then((result) => {
            console.log("result GET /results/search", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error GET /results/search", err);
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

app.get("/get-initial-status/:id", (req, res) => {
    console.log("/get-initial-status/:id req.body :", req.params.id);
    db.getInitialStatus(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            console.log("/get-initial-status/:id result.rows :", result.rows);
            if (result.rows.length == 0) {
                res.json({ friendStatus: null });
            } else {
                res.json(result.rows[0]);
            }
        })
        .catch((err) => {
            console.log("error /get-initial-status/:id", err);
            res.json(error);
        });
});

app.post("/make-friend-request/:id", (req, res) => {
    console.log("/make-friend-request/:id :", req.params.id);
    db.requestFriend(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            console.log("/make-friend-request/:id :", result.rows);
            res.json();
        })
        .catch((err) => {
            console.log("error /make-friend-request/:id :", err);
            res.json(error);
        });
});

app.post("/accept-friend-request/:id", (req, res) => {
    console.log("/accept-friend-request/:id :", req.params.id);
    db.acceptFriend(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            console.log("/accept-friend-request/:id :", result.rows);
            res.json();
        })
        .catch((err) => {
            console.log("error /accept-friend-request/:id  ", err);
            res.json(err);
        });
});

app.post("/end-friendship/:id", (req, res) => {
    console.log("/end-friendship/:id :", req.params.id);
    db.deleteFriend(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            console.log("/end-friendship/:id :", result.rows);
            res.json();
        })
        .catch((err) => {
            console.log("error /end-friendship/:id :", err);
            res.json(error);
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
