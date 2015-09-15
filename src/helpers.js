module.exports = {
  extend: function(a, b) {
    var key;

    for(key in b) {
      if (!a.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  },

  isRedirect: function(statusCode) {
    return [
      300, 301, 302, 303, 307
    ].indexOf(statusCode) !== -1;
  }
};
