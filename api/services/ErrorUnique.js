module.exports = {
  parseError: function(err, field, message) {
    if(err.details.indexOf("ER_DUP_ENTRY") !== -1 && err.details.indexOf(field) !== -1) {
      if(!err.Errors)
        err.Errors = [];
      if(!err.Errors[field])
        err.Errors[field] = [{message:message}]
      else
        err.Errors[field].push({message:message});
    }
    return err;
  }
}
