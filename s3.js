// saving file to aws

const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    //creating object to interact with aws
    accessKeyId: secrets.AWS_ID,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500); // end request upload if no file
    }

    const { filename, mimetype, size, path } = req.file; //multer created req.file

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            next();
            console.log("upload to aws is done");
            fs.unlink(path, () => {}); //delete link
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
};
