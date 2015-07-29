// Node modules
var https = require('https'),
  url = require('url');
  fs = require('fs');

// EdgeGrid Auth Module
var auth = require('./auth'),
  edgerc = require('./edgerc'),
  logger = require('./logger');

var _client_token = null,
  _client_secret = null,
  _access_token = null,
  _base_uri = null,
  _request = null;

var EdgeGrid = function(client_token, client_secret, access_token, base_uri) {
  // accepting an object containing a path to .edgerc and a config group
  if (typeof arguments[0] === 'object') {
    var path = arguments[0].path;
    var group = arguments[0].group;
    if (path === undefined) {
      logger.error("No .edgerc path");
      return false;
    }

    var config = edgerc(path, group);
    _client_token = config.client_token;
    _client_secret = config.client_secret;
    _access_token = config.access_token;
    _base_uri = config.host;
  }
  else {
    if (client_token === undefined || client_token === null) {
      logger.error("No client token");
      return false;
    } else if (client_secret === undefined || client_secret === null) {
      logger.error("No client secret");
      return false;
    } else if (access_token === undefined || access_token === null) {
      logger.error("No access token");
      return false;
    } else if (base_uri === undefined || base_uri === null) {
      logger.error("No base uri");
      return false;
    }

    _client_token = client_token;
    _client_secret = client_secret;
    _access_token = access_token;
    _base_uri = base_uri;
  }

  return this;

};

EdgeGrid.prototype.auth = function(request, callback) {
  _request = auth.generate_auth(request, _client_token, _client_secret, _access_token, _base_uri);

  if (callback && typeof callback == "function") {
    callback(this);
  }

  return this;
};

EdgeGrid.prototype.send = function(callback) {
  var request = _request,
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

module.exports = EdgeGrid;
