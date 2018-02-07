/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `UserController.login()`
   */
  login: function (req, res) {
    // See `api/responses/login.js`
    return res.login({
      successRedirect: '/',
      invalidRedirect: 'user/login'
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {

    if(req.param('email') === undefined || req.param('name') === undefined || req.param('password') === undefined)
      return res.badRequest({
        type: "error",
        message: 'Un problème est survenu avec le formulaire. Veuillez recharger la page.'
      }, {view: "user/signup"});

    var email = sails.he.encode(req.param('email'));
    var name = sails.he.encode(req.param('name'));

    // Attempt to signup a user using the provided parameters
    User.signup({
      name: name,
      email: email,
      password: sails.he.encode(req.param('password'))
    }, function (err, user) {
      if(err) {
        err = HelperData.errorUnique(err, "name", "Le nom d'utilisateur est déjà pris.");
        err = HelperData.errorUnique(err, "email", "Vous disposez déjà d'un compte avec cette adresse e-mail.");
        return res.badRequest({
          form: req.params.all(),
          errors: err.Errors
        }, {view:"user/signup"});
      }

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;

      // Envoyer l'email avec le token
      Mailer.sendMail({
          from: '"'+ sails.config.myconf.name +'" <no-reply@'+ sails.config.myconf.url +'>', // sender address
          to: 'f.romain2009@gmail.com', // list of receivers
          subject: 'Welcome'
        },
        "email/signup",
        {
          title:"Welcome",
          name: user.name,
          slug: user.slug,
          token: user.token
        }
      );

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.ok('Signup successful!');
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.redirect('/');
    });
  },

  activate: function(req, res){

    User.activate({
      slug: sails.he.encode(req.param("slug")),
      token: sails.he.encode(req.param("token"))
    },function(err, updated) {
      if(err || updated.length == 0) {
        return res.badRequest({
          form: req.params.all(),
          notification: {
            type: "error",
            message: "Un problème est survenu lors de l'activation de votre compte."
          }
        }, {view: "user/activate"});
      }
      return res.view("user/activate", {type: "success", message:'Votre compte a bien été activé.'});
    });
  }
};
