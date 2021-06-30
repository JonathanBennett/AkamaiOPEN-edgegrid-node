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

const uuid = require('uuid'),
    helpers = require('./helpers'),
    logger = require('./logger'),
    url = require('url');

function makeAuthHeader(request, clientToken, accessToken, clientSecret, timestamp, nonce, maxBody) {
    const keyValuePairs = {
        client_token: clientToken,
        access_token: accessToken,
        timestamp: timestamp,
        nonce: nonce
    };
    let joinedPairs = '',
        authHeader,
        signedAuthHeader,
        key;

    for (key in keyValuePairs) {
        joinedPairs += key + '=' + keyValuePairs[key] + ';';
    }

    authHeader = 'EG1-HMAC-SHA256 ' + joinedPairs;

    logger.info('Unsigned authorization header: ' + authHeader + '\n');

    signedAuthHeader = authHeader + 'signature=' + helpers.signRequest(request, timestamp, clientSecret, authHeader, maxBody);

    logger.info('Signed authorization header: ' + signedAuthHeader + '\n');

    return signedAuthHeader;
}

function makeURL(host, path, queryStringObj) {
    const parsed = new URL(path, host);
    if (queryStringObj) {
        const queryFromObject = new url.URLSearchParams();
        for (const key of Object.keys(queryStringObj)) {
            queryFromObject.append(key, queryStringObj[key]);
        }
        parsed.search = queryFromObject.toString();
    }

    return url.format(parsed);
}

module.exports = {
    generateAuth: function (request, clientToken, clientSecret, accessToken, host, maxBody, guid, timestamp) {
        maxBody = maxBody || 131072;
        guid = guid || uuid.v4();
        timestamp = timestamp || helpers.createTimestamp();

        if (!request.hasOwnProperty('headers')) {
            request.headers = {};
        }

        request.url = makeURL(host, request.path, request.qs);
        request.headers.Authorization = makeAuthHeader(request, clientToken, accessToken, clientSecret, timestamp, guid, maxBody);

        return request;
    }
};
