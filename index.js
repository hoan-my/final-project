///////SERVER run bundle-server.js and index.js

const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
//// bcrypt
const bc = require("./bc.js");
//// database
const db = require("./db.js");

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

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log(req.body);
    let userPass = req.body.password;
    if (userPass == "") {
        userPass = null;
    }
    let userFirst = req.body.first;
    if (userFirst == "") {
        userFirst = null;
    }
    let userLast = req.body.last;
    if (userLast == "") {
        userLast = null;
    }
    let userEmail = req.body.email;
    if (userEmail == "") {
        userEmail = null;
    }
    let error = {
        error: true,
    };

    bc.hash(userPass)
        .then((hashedUserPass) => {
            db.insertUser(userFirst, userLast, userEmail, hashedUserPass)
                .then((result) => {
                    console.log(result);
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

app.listen(8080, function () {
    console.log("server is running...");
});
