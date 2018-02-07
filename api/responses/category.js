module.exports = function category(data) {
  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  var categories;
  var slug;
  if(data.categories) {
    categories = data.categories
  }
  if(data.slug) {
    slug = data.slug
  }


  if(req.param("name") === undefined)
    return res.badRequest({
      notification: {
        type: "error",
        message: 'Un problème est survenu avec le formulaire. Veuillez recharger la page.',
        categories: categories,
        slug: slug
      }
    }, {view: data.view});

  var form = req.params.all();
  form.name = sails.he.encode(req.param("name"));

  var updateOrCreate = function(err){
    if(err) {
      err = HelperData.errorUnique(err, "name", "Le nom de la catégorie est déjà pris.");
      res.badRequest({
        form: form,
        errors: err.Errors,
        categories: categories,
        slug: slug
      }, {view:data.view});
      return true;
    }
    return false;
  }

  var create = function(err, item) {
    if(!updateOrCreate(err))
      return res.redirect('/category/edit/' + item.slug);
  };

  var update = function(err, item) {
    if(updateOrCreate(err))return;
    item = item[0]
    if(data.name != item.name) {
      return res.redirect('/category/edit/' + item.slug);
    }
    return res.view(data.view, {
      form: form,
      categories: categories,
      slug: slug
    });
  }

  if(data.cb == Category.new) {
    data.cb({
      name: form.name
    }, create) ;
  } else {
    data.cb({
      name: form.name,
      id: data.id,
    }, update);
  }
}
