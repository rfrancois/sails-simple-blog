/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

const saltRounds = 5;

module.exports = {

  attributes: {
    name: {
      type:"string",
      required: true,
      unique: true
    },
    slug: {
      type: 'slug',
      from: 'name',
      unique: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    token: {
      type: 'string',
      required: true
    },
    active: {
      type: 'boolean',
      required: true
    },
    role: {
      type: 'integer',
      required: 'true',
      defaultsTo: 1
    }
  },

  validationMessages: {
    name: {
      required: "Ce champ est obligatoire.",
    },
    email: {
      required: "Ce champ est obligatoire.",
      email: "Ce champ doit comporter une adresse e-mail valide."
    },
    password: {
      required: "Ce champ est obligatoire."
    }
  },

  /**
   * Create a new user using the provided inputs,
   * but encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • name     {String}
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  signup: function (inputs, cb) {
    // Create a user
    User.create({
      name: inputs.name,
      email: inputs.email,
      password: sails.bcrypt.hashSync(inputs.password, saltRounds),
      token: sails.randtoken.generate(16),
      active: false
    })
      .exec(cb);
  },

  exist: function(inputs, cb) {
    User.findOne({
      where: {
        or: [{
          email: inputs.email
        },{
          name: inputs.name
        }]
      }
    }).limit(1).exec(cb);
  },

  /**
   * Check validness of a login using the provided inputs.
   * But encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  attemptLogin: function (inputs, cb) {
    // Find the user with that e-mail address
    var user = User.findOne({
      email: inputs.email
    }).exec(function(err, user){
      // Si l'user n'est pas trouvé parce que ce n'est pas le bon mail ou que l'user n'est pas activé
      if(err || !user || user.active == 0) {
        cb(err, user);
        return;
      }
      // Compare password and hashed password from db
      sails.bcrypt.compare(inputs.password, user.password, function(errBcrypt, res) {
        if(res) {
          // Passwords match
          cb(err, user);
        } else {
          // Passwords don't match
          cb(errBcrypt, undefined);
        }
      });
    });
  },

  activate: function(inputs, cb) {
    User.update(
      {
        slug: inputs.slug,
        token: inputs.token,
        active: 0
      },
      {
        active:1,
        token:sails.randtoken.generate(16)
      }
    ).exec(cb);
  }
};
