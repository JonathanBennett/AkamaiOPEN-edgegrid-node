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

const crypto = require('crypto'),
    moment = require('moment'),
    logger = require('./logger'),
    path = require('path'),
    os = require('os');

module.exports = {
    createTimestamp: function () {
        return moment().utc().format('YYYYMMDDTHH:mm:ss+0000');
    },

    contentHash: function (request, maxBody) {
        let contentHash = '',
            preparedBody = request.body || '',
            isTarball = preparedBody instanceof Uint8Array && request.headers['Content-Type'] === 'application/gzip';

        if (typeof preparedBody === 'object' && !isTarball) {
            let postDataNew = '',
                key;

            logger.info('Body content is type Object, transforming to POST data');

            for (key in preparedBody) {
                postDataNew += key + '=' + encodeURIComponent(JSON.stringify(preparedBody[key])) + '&';
            }

            // Strip trailing ampersand
            postDataNew = postDataNew.replace(/&+$/, "");

            preparedBody = postDataNew;
            request.body = preparedBody; // Is this required or being used?
        }

        logger.info('Body is \"' + preparedBody + '\"');
        logger.debug('PREPARED BODY LENGTH', preparedBody.length);

        if (request.method === 'POST' && preparedBody.length > 0) {

            logger.info('Signing content: \"' + preparedBody + '\"');

            // If body data is too large, cut down to max-body size
            if (preparedBody.length > maxBody) {
                logger.warn('Data length (' + preparedBody.length + ') is larger than maximum ' + maxBody);
                if (isTarball)
                    preparedBody = preparedBody.slice(0, maxBody);
                else
                    preparedBody = preparedBody.substring(0, maxBody);
                logger.info('Body truncated. New value \"' + preparedBody + '\"');
            }

            logger.debug('PREPARED BODY', preparedBody);

            contentHash = this.base64Sha256(preparedBody);
            logger.info('Content hash is \"' + contentHash + '\"');
        }

        return contentHash;
    },

    dataToSign: function (request, authHeader, maxBody) {
        const parsedUrl = new URL(request.url),
            dataToSign = [
                request.method.toUpperCase(),
                parsedUrl.protocol.replace(":", ""),
                parsedUrl.host,
                parsedUrl.pathname + parsedUrl.search,
                this.canonicalizeHeaders(request.headersToSign),
                this.contentHash(request, maxBody),
                authHeader
            ];

        const dataToSignStr = dataToSign.join('\t').toString();

        logger.info('Data to sign: "' + dataToSignStr + '" \n');

        return dataToSignStr;
    },

    extend: function (a, b) {
        let key;

        for (key in b) {
            if (!a.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }

        return a;
    },

    isRedirect: function (statusCode) {
        return [
            300, 301, 302, 303, 307
        ].indexOf(statusCode) !== -1;
    },

    base64Sha256: function (data) {
        const shasum = crypto.createHash('sha256').update(data);

        return shasum.digest('base64');
    },

    base64HmacSha256: function (data, key) {
        const encrypt = crypto.createHmac('sha256', key);

        encrypt.update(data);

        return encrypt.digest('base64');
    },

    /**
     * Creates a String containing a tab delimited set of headers.
     * @param  {Object} headers Object containing the headers to add to the set.
     * @return {String}         String containing a tab delimited set of headers.
     */
    canonicalizeHeaders: function (headers) {
        const formattedHeaders = [];
        let key;

        for (key in headers) {
            formattedHeaders.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' '));
        }

        return formattedHeaders.join('\t');
    },

    signingKey: function (timestamp, clientSecret) {
        const key = this.base64HmacSha256(timestamp, clientSecret);

        logger.info('Signing key: ' + key + '\n');

        return key;
    },

    signRequest: function (request, timestamp, clientSecret, authHeader, maxBody) {
        return this.base64HmacSha256(this.dataToSign(request, authHeader, maxBody), this.signingKey(timestamp, clientSecret));
    },

    resolveHome: function (filePath) {
        if (filePath[0] === '~') {
            return path.join(os.homedir(), filePath.slice(1));
        }
        return filePath;
    },
};
