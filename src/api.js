// Node modules

var https = require('https'),
  url = require('url');
  fs = require('fs');
// EdgeGrid Auth Module
var auth = require('./auth.js');

var _client_token = null,
  _client_secret = null,
  _access_token = null,
  _base_uri = null,
  _request = null;

function parseEdgerc(path, conf) {
  var edgerc = fs.readFileSync(path).toString().split("\n");
  var confData = [];
  for(var i=0;i<edgerc.length;i++) {
    var matchConf = edgerc[i].match(/\[(.*)\]/);
    // if we found our matching config, push the next 4 lines into a temp array
    if (matchConf && matchConf[1] === conf) {
      confData.push(edgerc[i+1]);
      confData.push(edgerc[i+2]);
      confData.push(edgerc[i+3]);
      confData.push(edgerc[i+4]);
      // convert the array to a descriptive object
      confData = confData.map(function(el) {
        var ret = {}
        var key = el.split(' = ')[0].trim();
        var val = el.split(' = ')[1].trim();
        if (key === 'host') {
          val = 'https://' + val;
        }
        ret[key] = val;
        return ret;
      });
      // turn the array of objects into a single object
      var result = {};
      for (var i = 0, length = confData.length; i < length; i++) {
        result[Object.keys(confData[i])[0]] = confData[i][Object.keys(confData[i])[0]];
      }
      return result;
    }
  }
  // if we escaped the parse loop without returning, something is wrong
  throw('An error occurred parsing the .edgerc file. You probably specified an invalid group name.');
} 

var EdgeGrid = function(client_token, client_secret, access_token, base_uri) {
  // accepting an object containing a path to .edgerc and a config group
  if (typeof arguments[0] === 'object') {
    var path = arguments[0].path;
    var group = arguments[0].group;
    if (path === undefined) {
      console.log("No .edgerc path");
      return false;
    }
    if (group === undefined) {
      console.log("No .edgerc group provided, using 'default'");
      group = 'default';
    }
    var config = parseEdgerc(path, group);
    _client_token = config.client_token;
    _client_secret = config.client_secret;
    _access_token = config.access_token;
    _base_uri = config.host;
  }
  else {
    if (client_token === undefined || client_token === null) {
      console.log("No client token");
      return false;
    } else if (client_secret === undefined || client_secret === null) {
      console.log("No client secret");
      return false;
    } else if (access_token === undefined || access_token === null) {
      console.log("No access token");
      return false;
    } else if (base_uri === undefined || base_uri === null) {
      console.log("No base uri");
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
