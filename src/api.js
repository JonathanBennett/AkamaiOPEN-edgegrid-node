var https = require('https'),
    url = require('url'),
    request = require('request'),
    fs = require('fs'),
    auth = require('./auth'),
    edgerc = require('./edgerc'),
    logger = require('./logger');

var EdgeGrid = function(client_token, client_secret, access_token, host) {
  // accepting an object containing a path to .edgerc and a config group
  if (typeof arguments[0] === 'object') {
    var path = arguments[0].path;
    var group = arguments[0].group;
    if (path === undefined) {
      if (!process.env.EDGEGRID_ENV === 'test') {
        logger.error('No .edgerc path');
      }

      throw new Error('No edgerc path');
    }

    this.config = edgerc(path, group);
  } else {
    if (!validatedArgs([client_token, client_secret, access_token, host])) {
      throw new Error('Insufficient Akamai credentials');
    }

    this.config = {
      client_token: client_token,
      client_secret: client_secret,
      access_token: access_token,
      host: host
    };
  }

  return this;
};

EdgeGrid.prototype.auth = function(req, callback) {
  this.request = auth.generate_auth(req, this.config.client_token, this.config.client_secret, this.config.access_token, this.config.host);

  if (callback && typeof callback == "function") {
    callback(this);
  }

  return this;
};

EdgeGrid.prototype.send = function(callback) {
  request(this.request, function(error, response, body) {
    if (error) { throw new Error(error); }

    callback(body, response);
  });
};

function validatedArgs(args) {
  var expected = [
        'client_token', 'client_secret', 'access_token', 'base_uri'
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
