//const express = require("express");
// const cors = require("cors");
//const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");

//const app = express();
//const PORT = process.env.PORT || 5000;

// const mailjet = require("node-mailjet").connect(
//   "****************************1234",
//   "****************************abcd"
// );
const env = require("./controller/env");

const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

const request = mailjet.post("send", { version: "v3.1" }).request({
  Messages: [
    {
      From: {
        Email: "michael@milan-muc.de",
        Name: "Michael",
      },
      To: [
        {
          Email: "michael@milan-muc.de",
          Name: "Michael",
        },
      ],
      Subject: "Greetings from Mailjet.",
      TextPart: "My first Mailjet email",
      HTMLPart:
        "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      CustomID: "AppGettingStartedTest",
    },
  ],
});

request
  .then((result) => {
    console.log(result.body);
  })
  .catch((err) => {
    console.log(err.statusCode);
  });

// app.listen(PORT, () => {
//   console.log("Server is started");
// });

//const appRoute = require("./routes/route.js");

// app.use(cors({ origin: "*" }));
// app.use(bodyParser.json());
//app.use(express.json());

/*routes*/
//app.use("/api", appRoute);

// app.post("/mailer", (req, res) => {
//   console.log("request came");
//   let user = req.body;
//   sendMail(user, (err, info) => {
//     if (err) {
//       console.log(err);
//       res.status(400);
//       res.send({ error: "Fails to send email" });
//     } else {
//       console.log("Email has been sent");
//       res.send(info);
//     }
//   });
// });

// const mailer = (user, callback) => {
//   const transport = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "lm28081983@gmail.com",
//       pass: "dwptcuahvrbjpipg",
//     },
//   });
// };

// const mailOptions = {
//   from: `"Micha"`,
//   to: `<$ml@milan-muc.de>`,
//   subject: "Hello World",
//   html: "<h1>And here is the HTML Tag</h1>",
// };

// transport.sendMail(mailOptions, callback);

//https://www.youtube.com/watch?v=lBRnLXwjLw0
