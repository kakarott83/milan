const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("./env");
const Mail = require("nodemailer/lib/mailer");
const signUp = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  let config = {
    service: "Gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(config);

  // send mail with defined transport object
  let message = await transporter.sendMail({
    from: '"Fredy Foo 👻" <foo@example.com>', // sender address
    to: "michael@milan-muc.de, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    //text: "Test?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "you should receive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(message),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  //res.status(201).json("Signup Sucessfully");
};

const getBill = (req, res) => {
  const { userEmail } = req.body;

  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: "Daily Tutorial",
      intro: "Your bill",
      table: {
        data: [
          {
            item: "Nodemail Stack",
            describe: "A Backend Application",
            price: "10$",
          },
        ],
      },
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "Place Order",
    html: mail,
  };

  let transporter = nodemailer.createTransport(config);

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  //res.status(201).json("getBill Sucessfully");
};

module.exports = {
  signUp,
  getBill,
  strato,
};
