/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function(req, res) {
    var view = "category/new";

    if (req.method.toUpperCase() == 'GET') {
      return res.view(view);
    }

    return res.category({
      cb: Category.new,
      view: view
    });
  },

  edit: function(req, res) {
    var view = "category/edit";

    if(!req.param("slug"))
      return res.notFound();

    var slug = sails.he.encode(req.param("slug"));

    Category.getCategoryBySlug(slug, function(err, item){
      if(err || !item) {
        return res.notFound();
      }

      /*
      if(item.author.role > 2) {
        return res.forbidden("Vous n'êtes pas l'auteur de cet article et ne pouvez par conséquent pas le modifier.");
      }*/

      Category.find().exec(function(err, categories){
        if (req.method.toUpperCase() == 'GET') {
          return res.view(view, {
            form: HelperData.edit(item, req.params.all()),
            categories: categories,
            slug: slug
          });
        }

        return res.category({
          cb: Category.edit,
          view: view,
          id: item.id,
          name: item.name,
          categories: categories,
          slug: slug
        });
      });
    });
  },

  delete: function(req, res) {
    if(!req.param("slug"))
      return res.notFound();

    var slug = sails.he.encode(req.param("slug"));

    Category.destroy({slug:slug}).exec(function(err){
      if(err) {
        return res.notFound("La catégorie à supprimer n'a pas été trouvée.")
      }
      return res.redirect('/');
    });
  }
};
