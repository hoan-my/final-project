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
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    res.locals.user = req.session.user;
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
    let password = req.body.password;
    if (password == "") {
        password = null;
    }
    let first = req.body.first;
    if (first == "") {
        first = null;
    }
    let last = req.body.last;
    if (last == "") {
        last = null;
    }
    let email = req.body.email;
    if (email == "") {
        email = null;
    }
    let error = {
        error: true,
    };

    bc.hash(userPass)
        .then((hashedUserPass) => {
            db.insertUser(first, last, email, hashedUserPass)
                .then((result) => {
                    console.log("result in insertUser:", result);
                    req.session.userId = result.rows[0].id;
                    res.json();
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
    let password = req.body.password;
    if (password == "") {
        password = null;
    }
    let email = req.body.email;
    if (email == "") {
        email = null;
    }
    let error = {
        error: true,
    };
    db.getUser(email, password)
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

                        res.redirect("/"); // change path here
                    } else {
                        res.sendStatus(401);
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

app.post("/password/reset/start", (req, res) => {
    let email = req.body.email;
    if (email == "") {
        email = null;
    }
    let error = {
        error: true,
    };
    console.log("/password/reset/start", req.body);
    db.getUser(req.body.email)
        .then((result) => {
            console.log("result rows /password/reset/start:", result.rows);
            if (result.rows.length == 0) {
                res.json(error);
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log(secretCode);
                db.insertResetCode(email, secretCode)
                    .then(() => {
                        sendEmail(
                            userEmail,
                            "Your secret code",
                            `In order to reset your password, please enter your : ${secretCode}`
                        )
                            .then(() => {
                                res.json();
                            })
                            .catch((err) => {
                                console.log(
                                    "error in sendEmail /password/reset/start:",
                                    err
                                );
                                res.json(error);
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "error in inserResetCode /password/reset/start:",
                            err
                        );
                        res.json(error);
                    });
            }
        })
        .catch((err) => {
            console.log("error in getUser /password/reset/start:", err);
            res.json(error);
        });
});

app.post("/password/reset/verify", (req, res) => {
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
            console.log(result.rows);
            if (resetCode == result.rows[0].code) {
                hash(changedPassword)
                    .then((hashedPassword) => {
                        db.updatePassword(email, hashedPassword)
                            .then(() => {
                                res.json({ passwordUpdated: true });
                            })
                            .catch((err) => {
                                console.log(
                                    "error in updatePassword /password/reset/verify:",
                                    err
                                );
                                res.json(error);
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "error in hash /password/reset/verify:",
                            err
                        );
                        res.json(error);
                    });
            } else {
                res.json(error);
            }
        })
        .catch((err) => {
            console.log("error in checkResetCode /password/reset/verify:", err);
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
