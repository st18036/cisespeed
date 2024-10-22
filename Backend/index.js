const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const http = require('http');
const nodemailer = require('nodemailer');

// routes
const articles = require('./routes/api/articles');
const routes = require('./routes/api/articles');
const app = express();
const server = http.Server(app);



// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

//app.get('/', (req, res) => res.send('Hello world!'));

app.use('/api/articles', articles);
app.use('/api', routes);

const port = process.env.PORT || 8082;

app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views/index.html")));

//Routing 
app.get("/", function (req, response) {
    response.sendFile(path.join(__dirname, "views/index.html"))
})

app.post("/send_email", function (req, response) {
    const from = req.body.from;
    const to = req.body.to;
    const subject = req.body.subject;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: "gmail", // Use a colon, not an equal sign
        auth: {
            user: 'cloudtechnology8@gmail.com',
            pass: 'wodm vrhh iubf uucz'
        }
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: message
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log("Email send: " + info.response)
        }
        response.redirect("")
    })
    
})


app.listen(port, () => console.log(`Server running on port ${port}`));

