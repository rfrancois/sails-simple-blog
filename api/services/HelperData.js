module.exports = {
  errorUnique: function(err, field, message) {
    if(err.details.indexOf("ER_DUP_ENTRY") !== -1 && err.details.indexOf(field) !== -1) {
      if(!err.Errors)
        err.Errors = [];
      if(!err.Errors[field])
        err.Errors[field] = [{message:message}]
      else
        err.Errors[field].push({message:message});
    }
    return err;
  },
  edit: function(e, form) {
    for (var key in e) {
      if (!e.hasOwnProperty(key)) {
        continue;
      }
      form[key] = e[key];
    }
    return form;
  },
  categories: function(categories, categoriesSelected) {
    if(!categoriesSelected) return;
    var tmp = [];
    for(var i=0; i<categoriesSelected.length; i++) {
      var category = categories.find(function(item){
        return categoriesSelected[i] == item.slug;
      });
      if(category && category.id)
        tmp.push(category.id);
    }
    return tmp;
  }
}
