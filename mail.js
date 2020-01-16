const nodemailer = require('nodemailer');

var sendEmail = function(host, port, secure, user, pass, to,subject, body, fileName, pathToFile){
    nodemailer.createTestAccount((err, account)=> {
        if(err)
            console.log('error enviando email:', err);
        else{
            console.log(host, port, secure, user, pass, to, subject, body, fileName, pathToFile)
            let transporter = nodemailer.createTransport({
                //   host: 'smtp.googlemail.com', // Gmail Host
                //   port: 465, // Port
                //   secure: true, // this is true as port is 465
                //   auth: {
                    //       user: '', //Gmail username
                    //       pass: '' // Gmail password
                    //   }
                    host: host, // Gmail Host
                    port: port, // Port
                    secure: secure, // this is true as port is 465
                    auth: {
                        user: user, //Gmail username
                        pass: pass // Gmail password
                    }
                });
                let mailOptions = {
                    from: `${user}`,
                    to: `${to}`, // Recepient email address. Multiple emails can send separated by commas
                    subject: `${subject}`,
                    html: `${body}`,
                    attachments : [
                        {
                            filename : fileName,
                            path : pathToFile
                        }
                    ]
                };
                transporter.sendMail(mailOptions,(err,info) => {
                    if(err)
                    console.log('Error mail:', err);
                    else{
                        console.log('Message sent!')
                        
                    }
                })
            }
      })
      
}

module.exports = {sendEmail}