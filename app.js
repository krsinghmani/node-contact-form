const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');


const app =express();

//View engine setup
app.engine('handlebars',exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname,'public')));

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/',(req,res) =>{
    res.render('contact');
})

app.post('/send', (req,res)=>{
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Detailes</h3>
        <ul>
           <li>Name: ${req.body.name}</li>
           <li>Company: ${req.body.company}</li>
           <li>Email: ${req.body.email}</li>
           <li>Phone: ${req.body.phone}</li> 
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'krsinghmani@gmail.com', // generated ethereal user
            pass: 'hirehire271@' // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact " <krsinghmani@gmail.com>', // sender address
        to: 'manishkumr66271@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('Contact', {msg:'Email has been sent...'});
    });
    
});

app.listen(3000, ()=>{
    console.log('Server started....');
    
})