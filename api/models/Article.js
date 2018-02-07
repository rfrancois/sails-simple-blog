/**
 * Article.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type:"string",
      required: true,
      unique : true
    },
    slug: {
      type: 'slug',
      from: 'title',
      unique: true
    },
    text: {
      type:"text",
      required: true,
    },
    author: {
      model:'User',
      required: true
    },
    categories: {
      collection: 'category',
      via: 'articles',
      dominant: true,
      required: true,
      through: 'articlecategories',
    }
  },

  validationMessages: {
    title: {
      required: "Le titre doit être renseigné."
    },
    text: {
      required: "Vous devez écrire un texte."
    },
    categories: {
      required: "Au moins une catégorie doit être cochée."
    }
  },

  new: function (inputs, cb) {
    Article.create({
      title: inputs.title,
      text: inputs.text,
      author: inputs.author,
      categories: inputs.categories
    })
      .exec(cb);
  },

  edit: function(inputs, cb) {
    Article.update({
      id: inputs.id
    },{
      title: inputs.title,
      slug: sails.slugify(inputs.title, {
        lower:true
      }),
      text: inputs.text,
      author: inputs.author,
      categories: inputs.categories
    }).exec(cb);
  },

  getArticleBySlug: function(slug, cb) {
    Article.findOne({
      slug:slug
    }).populate(["author", "categories"]).exec(cb);
  }
};

