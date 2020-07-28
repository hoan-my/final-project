///////SERVER run bundle-server.js and index.js

const express = require("express");
const app = express();

const compression = require("compression");

////socket.io
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 mysocialnetwork.herokuapp.com",
}); //header origin rejecting users with different origins /!\ change origins if deploys on heroku

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

// app.use(
//     cookieSession({
//         secret: `I eat chocolate everyday`,
//         maxAge: 1000 * 60 * 24 * 14,
//     })
// );

//store in a var and let socket access to cookies
const cookieSessionMiddleware = cookieSession({
    secret: `I eat chocolate everyday.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
    console.log("req.session.userId:", req.session);
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
                    req.session.userId = result.rows[0].id;
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
                        req.session.userId = result.rows[0].id;

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

app.post("/form", (req, res) => {
    console.log(req.body);
    db.insertForm(req.body.dateStart, req.body.dateEnd, req.body.location)
        .then((result) => {
            console.log("result in insertForm:", result);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error in insertForm:", err);
            res.json(error);
        });
});

app.get("/plan", (req, res) => {
    console.log("req.session.id:", req.session.userId);
    db.getPlanner(req.session.userId)
        .then((result) => {
            console.log("result GET /planner: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log("Error in GET/user: ", err);
        });
});

app.post("/plan", (req, res) => {
    console.log(req.body);
    db.insertPlan(
        req.body.date,
        req.body.toDo,
        req.body.toEat,
        req.body.toSleep
    )
        .then((result) => {
            console.log("result in insertPlan:", result);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error in insertPlan:", err);
            res.json(error);
        });
});

app.get("/user", (req, res) => {
    console.log("req.session.id:", req.session.userId);
    db.getUser(req.session.userId)
        .then((result) => {
            console.log("result GET /user: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log("Error in GET/user: ", err);
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

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//socket.io
server.listen(8080, function () {
    console.log("server is running...");
});

io.on("connection", function (socket) {
    console.log(`socket with id ${socket.id} just CONNECTED!`);
    const userId = socket.request.session.userId;
    //only run socket when user is logged in
    if (!userId) {
        return socket.disconnect(true);
    }

    db.getLastTenMsgs()
        .then((data) => {
            io.sockets.emit("chatMessages", data.rows);
            console.log("Last 10 messages: ", data.rows);
        })
        .catch((err) => {
            console.log("Error in getLastTenMsgs:", err);
        });

    socket.on("My amazing chat message", (newMsg) => {
        db.sendMessage(newMsg, userId)
            .then((result) => {
                console.log("Message sent: ", result.rows[0]);
                db.getSenders(userId)
                    .then((result) => {
                        console.log("sender: ", result.rows[0]);
                        io.sockets.emit("chatMessage", result.rows[0]);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log("error in sendMessage: ", err);
            });
    });
});
