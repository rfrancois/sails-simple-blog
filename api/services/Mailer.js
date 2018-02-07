const nodemailer = require('nodemailer');

module.exports = {

  /* Exemple de comment utiliser la fonction pour envoyer un mail
  Mailer.sendMail({
      from: '"Fred Foo" <foo@trol.com>', // sender address
      to: 'f.romain2009@gmail.com', // list of receivers
      subject: 'Hello'
    },
    "email/signup",
    {
      title:"Bienvenue", name: "Romain"
    }
  );*/

  // create reusable transporter object using the default SMTP transport
  sendMail: function(mailOptions, view, data) {
    this.renderView(view, data, function(html){
      mailOptions.html = html;
      mailOptions.subject = sails.config.myconf.name + ' - ' + mailOptions.subject;

      var transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 25,
        secure: false, // true for 465, false for other ports
      });

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          sails.log.error(error);
          return;
        }
        /*console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));*/
      });
    });
  },

  renderView: function(view, data, cb) {
    sails.hooks.views.render(view, data, function(err,html){
      if(err) {
        cb(html);
        return;
      }
      cb(html);
    });
  }
}
