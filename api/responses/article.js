module.exports = function article(data) {
  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  if(req.param("title") === undefined || req.param("text") === undefined)
    return res.badRequest({
      notification: {
        type: "error",
        message: 'Un problème est survenu avec le formulaire. Veuillez recharger la page.'
      },
      categories: data.categories
    }, {view: data.view});

  var form = req.params.all();
  form.title = sails.he.encode(req.param("title"));
  form.text = sails.sanitizeHtml(req.param("text"));

  var updateOrCreate = function(err){
    if(err) {
      err = HelperData.errorUnique(err, "title", "Le titre est déjà pris.");
      res.badRequest({
        form: form,
        errors: err.Errors,
        categories: data.categories
      }, {view:data.view});
      return true;
    }
    return false;
  }

  var create = function(err, article) {
    if(!updateOrCreate(err))
      return res.redirect('/article/edit/' + article.slug);
  };

  var update = function(err, article) {
    if(updateOrCreate(err))return;
    article = article[0]
    if(data.title != article.title) {
      return res.redirect('/article/edit/' + article.slug);
    }
    return res.view(data.view, {
      form: form,
      categories: data.categories
    });
  }

  var categories = HelperData.categories(data.categories, req.param("categories"));

  if(data.cb == Article.new) {
    data.cb({
      title: form.title,
      text: form.text,
      author: req.session.me,
      categories: categories
    }, create) ;
  } else {
    data.cb({
      title: form.title,
      text: form.text,
      author: req.session.me,
      id: data.id,
      categories: categories
    }, update);
  }
}
