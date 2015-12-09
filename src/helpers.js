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

var crypto = require('crypto'),
    moment = require('moment'),
    url = require('url'),
    logger = require('./logger');

module.exports = {
  createTimestamp: function() {
    return moment().utc().format('YYYYMMDDTHH:mm:ss+0000');
  },

  contentHash: function(request, maxBody) {
    var contentHash = '',
        preparedBody = request.body || '';

    if (typeof preparedBody === 'object') {
      var postDataNew = '',
          key;

      logger.info('body content is type object, transforming to post data');

      for (key in preparedBody) {
        postDataNew += key + '=' + encodeURIComponent(JSON.stringify(preparedBody[key])) + '&';
      }

      preparedBody = postDataNew;
      request.body = preparedBody;
    }

    logger.info('body is \"' + preparedBody + '\"');
    logger.debug('PREPARED BODY LENGTH', preparedBody.length);

    if (request.method === 'POST' && preparedBody.length > 0) {
      logger.info('Signing content: \"' + preparedBody + '\"');

      if (preparedBody.length > maxBody) {
        logger.warn('Data length (' + preparedBody.length + ') is larger than maximum ' + maxBody);
        preparedBody = preparedBody.substring(0, maxBody);
        logger.info('Body truncated. New value \"' + preparedBody + '\"');
      }

      logger.debug('PREPARED BODY', preparedBody);

      contentHash = this.base64Sha256(preparedBody);
      logger.info('Content hash is \"' + contentHash + '\"');
    }

    return contentHash;
  },

  dataToSign: function(request, authHeader, maxBody) {
    var parsedUrl = url.parse(request.url, true),
        dataToSign = [
          request.method.toUpperCase(),
          parsedUrl.protocol.replace(":", ""),
          parsedUrl.host,
          parsedUrl.path,
          this.canonicalizeHeaders(request),
          this.contentHash(request, maxBody),
          authHeader
        ].join('\t').toString();

    logger.info('data to sign: "' + dataToSign + '" \n');

    return dataToSign;
  },

  extend: function(a, b) {
    var key;

    for (key in b) {
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
  },

  base64Sha256: function(data) {
    var shasum = crypto.createHash('sha256').update(data);

    return shasum.digest('base64');
  },

  base64HmacSha256: function(data, key) {
    var encrypt = crypto.createHmac('sha256', key);

    encrypt.update(data);

    return encrypt.digest('base64');
  },

  canonicalizeHeaders: function(request) {
    var formattedHeaders = [],
        headers = request.headers,
        key;

    for (key in headers) {
      formattedHeaders.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' '));
    }

    return formattedHeaders.join('\t');
  },

  signingKey: function(timestamp, clientSecret) {
    var key = this.base64HmacSha256(timestamp, clientSecret);

    logger.info('Signing key: ' + key + '\n');

    return key;
  },

  signRequest: function(request, timestamp, clientSecret, authHeader, maxBody) {
    return this.base64HmacSha256(this.dataToSign(request, authHeader, maxBody), this.signingKey(timestamp, clientSecret));
  }
};
