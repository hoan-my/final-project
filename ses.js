const aws = require("aws-sdk"); /

let secrets;
if (process.env.NODE_ENV == "production") { // heroku set up 
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = function (to, subject, message) {
    return ses.sendEmail({
        Source: "WOMEN COLORS TECH <humdrum.meerkat@spicedling.email>", //e-mail address where the email is being sent from
        Destination: { ToAddresses: [to] }, // if you're using spiced creds, we can only send emails to adresses signed up in spiced
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        }
    }).promise()
        .then(() => console.log('it worked!'))
        .catch(err => console.log(err));
};

//call send email ("recipients", "subject line", "body of the email")
//sendEmail("recipients", "subject line", "body of the email").then(() => { }).catch(err => { })