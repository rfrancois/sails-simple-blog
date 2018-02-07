/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: function(req, res) {
    var view = "article/new";
    Category.find().exec(function(err, categories){
      if(err) return res.serverError();
      if(categories.length == 0) return res.badRequest({notification:{
        type:"error",
        message:"Il faut créer au moins une catégorie avant de poster des articles."
      }},{view:view});

      if (req.method.toUpperCase() == 'GET') {
        return res.view(view, {
          categories: categories
        });
      }

      return res.article({
        cb: Article.new,
        view: view,
        categories: categories
      });
    });
  },

  edit: function(req, res) {
    var view = "article/new";

    if(!req.param("slug"))
      return res.notFound();

    var slug = sails.he.encode(req.param("slug"));

    Article.getArticleBySlug(slug, function(err, article){
      if(err || !article) {
        return res.notFound();
      }

      if(req.session.me != article.author.id && article.author.role <= 1) {
        return res.forbidden("Vous n'êtes pas l'auteur de cet article et ne pouvez par conséquent pas le modifier.");
      }

      Category.find().exec(function(err, categories){
        if (req.method.toUpperCase() == 'GET') {
          return res.view(view, {
            form: HelperData.edit(article, req.params.all()),
            categories: categories
          });
        }

        return res.article({
          cb: Article.edit,
          view: view,
          id: article.id,
          title: article.title,
          categories: categories
        });
      });
    });
  },

  list: function(req, res) {
    var view = "article/list";

    var page = 1;
    if(req.param("page")) {
      page = parseInt(req.param("page"));
    }

    sails.pager.paginate(Article, {}, page, 2, ["author", "categories"], 'createdAt DESC', function(err, records){
      if(err) {
        sails.log.error(err);
        return res.serverError();
      }
      if(records.data.length == 0) return res.notFound();
      res.view(view, {records: records});
    });
  }
};
