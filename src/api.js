var request = require('request'),
    fs = require('fs'),
    auth = require('./auth'),
    edgerc = require('./edgerc'),
    helpers = require('./helpers'),
    logger = require('./logger');

var EdgeGrid = function(client_token, client_secret, access_token, host) {
  // accepting an object containing a path to .edgerc and a config group
  if (typeof arguments[0] === 'object') {
    this._setConfigFromObj(arguments[0]);
  } else {
    this._setConfigFromStrings(client_token, client_secret, access_token, host);
  }
};

EdgeGrid.prototype.auth = function(req) {
  req = helpers.extend(req, {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    },
     "body": {}
  });

  this.request = auth.generate_auth(req, this.config.client_token, this.config.client_secret, this.config.access_token, this.config.host);
};

EdgeGrid.prototype.send = function(callback) {
  request(this.request, function(error, response, body) {
    if (error) { throw new Error(error); }

    callback(body, response);
  });
};

EdgeGrid.prototype._setConfigFromObj = function(obj) {
  if (!obj.path) {
    if (!process.env.EDGEGRID_ENV === 'test') {
      logger.error('No .edgerc path');
    }

    throw new Error('No edgerc path');
  }

  this.config = edgerc(obj.path, obj.group);
};

EdgeGrid.prototype._setConfigFromStrings = function(client_token, client_secret, access_token, host) {
  if (!validatedArgs([client_token, client_secret, access_token, host])) {
    throw new Error('Insufficient Akamai credentials');
  }

  this.config = {
    client_token: client_token,
    client_secret: client_secret,
    access_token: access_token,
    host: host.indexOf('https://') > -1 ? host : 'https://' + host
  };
};

function validatedArgs(args) {
  var expected = [
        'client_token', 'client_secret', 'access_token', 'host'
      ],
      valid = true,
      i;

  expected.forEach(function(arg, i) {
    if (!args[i]) {
      if (process.env.EDGEGRID_ENV !== 'test' ) {
        logger.error('No defined ' + arg);
      }

      valid = false;
    }
  });

  return valid;
}

module.exports = EdgeGrid;
