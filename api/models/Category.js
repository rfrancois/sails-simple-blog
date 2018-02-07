module.exports = {

  attributes: {
    name: {
      type:"string",
      required: true,
      unique : true
    },
    slug: {
      type: 'slug',
      from: 'name',
      unique: true
    },
    articles: {
      collection: 'article',
      via: 'categories',
      through: 'articlecategories',
    }
  },

  validationMessages: {
    name: {
      required: "Ce champ est obligatoire."
    }
  },

  new: function (inputs, cb) {
    Category.create({
      name: inputs.name
    })
      .exec(cb);
  },

  edit: function(inputs, cb) {
    Category.update({
      id: inputs.id
    },{
      name: inputs.name,
      slug: sails.slugify(inputs.name, {
        lower:true
      })
    }).exec(cb);
  },

  getCategoryBySlug: function(slug, cb) {
    Category.findOne({
      slug:slug
    }).exec(cb);
  },

  afterDestroy: function(items, cb) {
    var ids = [];
    for(var i=0; i<items.length; i++) {
       ids.push(items[i].id);
    }
    ArticleCategories.destroy({category:ids}).exec(function(err){
      cb();
    });
  }
};

