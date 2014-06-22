// Node modules

var https = require('https'),
  url = require('url');
// EdgeGrid Auth Module
var auth = require('./auth.js');

var _client_token = null,
  _client_secret = null,
  _access_token = null,
  _request = null;

var EdgeGrid = function(client_token, client_secret, access_token) {

  if (client_token === undefined || client_token === null) {
    console.log("No client token");
    return false;
  } else if (client_secret === undefined || client_secret === null) {
    console.log("No client secret");
    return false;
  } else if (access_token === undefined || access_token === null) {
    console.log("No access token");
    return false;
  }

  _client_token = client_token;
  _client_secret = client_secret;
  _access_token = access_token;

  return this;

};

EdgeGrid.prototype.auth = function(request, callback) {
  _request = auth.generate_auth(request, _client_token, _client_secret, _access_token);

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

  if (request.method == "POST" || request.method == "PUT") {
    request.headers["content-type"] = 'application/x-www-form-urlencoded';
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

  if (request.method == "POST" || request.method == "PUT") {
    req.write(request.body);
  }

  req.end();
};

module.exports = EdgeGrid;
