// Copyright 2014 Akamai Technologies, Inc. All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var uuid = require('node-uuid'),
    _ = require('underscore'),
    helpers = require('./helpers'),
    logger = require('./logger');

var _max_body = null;

var sign_request = function(request, timestamp, client_secret, auth_header) {
  return helpers.base64HmacSha256(helpers.dataToSign(request, auth_header, _max_body), helpers.signingKey(timestamp, client_secret));
};

var make_auth_header = function(request, client_token, access_token, client_secret, timestamp, nonce) {
  var key_value_pairs = {
    "client_token": client_token,
    "access_token": access_token,
    "timestamp": timestamp,
    "nonce": nonce
  };

  var joined_pairs = "";
  _.each(key_value_pairs, function(value, key) {
    joined_pairs += key + "=" + value + ";";
  });

  var auth_header = "EG1-HMAC-SHA256 " + joined_pairs;

  logger.info("Unsigned authorization header: " + auth_header + "\n");

  var signed_auth_header = auth_header + "signature=" + sign_request(request, timestamp, client_secret, auth_header);

  logger.info("Signed authorization header: " + signed_auth_header + "\n");

  return signed_auth_header;
};

module.exports = {
  generate_auth: function(request, client_token, client_secret, access_token, host, max_body, guid, timestamp) {
    _max_body = max_body || 2048;

    guid = guid || uuid.v4();
    timestamp = timestamp || helpers.createTimestamp();

    if (!request.hasOwnProperty("headers")) {
      request.headers = {};
    }
    request.url = host + request.path;
    request.headers.Authorization = make_auth_header(request, client_token, access_token, client_secret, timestamp, guid);
    return request;
  }
};
