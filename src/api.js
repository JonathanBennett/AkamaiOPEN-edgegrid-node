// Node modules
var https = require('https'),
  url = require('url');
  fs = require('fs');

// EdgeGrid Auth Module
var auth = require('./auth'),
  edgerc = require('./edgerc'),
  logger = require('./logger');

var EdgeGrid = function(client_token, client_secret, access_token, base_uri) {
  // accepting an object containing a path to .edgerc and a config group
  if (typeof arguments[0] === 'object') {
    var path = arguments[0].path;
    var group = arguments[0].group;
    if (path === undefined) {
      logger.error("No .edgerc path");
      return false;
    }

    this.config = edgerc(path, group);
  } else {
    if (!validatedArgs([client_token, client_secret, access_token, base_uri])) {
      throw new Error('Insufficient Akamai credentials');
    }

    this.config = {
      client_token: client_token,
      client_secret: client_secret,
      access_token: access_token,
      base_uri: base_uri
    };
  }

  return this;
};

EdgeGrid.prototype.auth = function(request, callback) {
  this.request = auth.generate_auth(request, this.config.client_token, this.config.client_secret, this.config.access_token, this.config.base_uri);

  if (callback && typeof callback == "function") {
    callback(this);
  }

  return this;
};

EdgeGrid.prototype.send = function(callback) {
  var request = this.request,
    data = "";

  var parts = url.parse(request.url);
  request.hostname = parts.hostname;
  request.port = parts.port;
  request.path = parts.path;

  // headers are case-insensitive so this function returns the value of a header
  // no matter what its case is. Returns undefined if there's no header defined.
  request.getHeader = function(header) {
    var result = undefined;
    for (k in this.headers) {
      if (k.toLowerCase() === header) {
        result = this.headers[k];
        break;
      }
    }
    return result;
  }

  if (request.method == "POST" || request.method == "PUT" || request.method == "DELETE") {
    // Accept user-defined, case-insensitive content-type header -- or use default type
    request.headers['content-type'] = request.getHeader('content-type') || 'application/x-www-form-urlencoded';
    request.headers['content-length'] = request.body.length;
  }

  var req = https.request(request, function(res) {
    res.on('data', function(d) {
      data += d;
    });

    res.on('end', function() {
      if (callback && typeof callback == "function") {
        callback(data, res);
      }

    });
  });

  if (request.method == "POST" || request.method == "PUT" || request.method == "DELETE") {
    req.write(request.body);
  }

  req.end();
};

function validatedArgs(args) {
  var expected = [
    'client_token', 'client_secret', 'access_token', 'base_uri'
  ],
  valid = true,
  i;

  expected.forEach(function(arg, i) {
    if (!args[i]) {
      logger.error('No defined ' + arg);
      valid = false;
    }
  });

  return valid;
}

module.exports = EdgeGrid;
