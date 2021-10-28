# EdgeGrid for Node.js

[![Build Status](https://travis-ci.org/akamai/AkamaiOPEN-edgegrid-node.svg?branch=master)](https://travis-ci.org/akamai/AkamaiOPEN-edgegrid-node)

This library implements an Authentication handler for the Akamai EdgeGrid Authentication scheme in Node.js. 

It’s Akamai’s current and officially supported version of AkamaiOPEN EdgeGrid for Node.js. 
You can find the most up-to-date package in [NPM](https://www.npmjs.com/package/akamai-edgegrid) under `akamai-edgegrid`.

> __IMPORTANT:__ Akamai will not maintain the `edgegrid` package in NPM going forward.

## Installation

`npm install --save akamai-edgegrid`

## Example

### Credentials

To use Akamai APIs you must first register and authorize a set of credentials through [Control Center](https://control.akamai.com). You can find more information on creating and authorizing credentials at [Authenticate with EdgeGrid](https://developer.akamai.com/getting-started/edgegrid).

### .edgerc authentication

The preferred method of using the library involves providing the path to an `.edgerc` file. This file contains the authentication credentials used to sign your requests.

> __NOTE__: Requests to the API are signed with a timestamp and are executed immediately.

```javascript
var EdgeGrid = require('akamai-edgegrid');

var data = 'bodyData';

// Supply the path to your .edgerc file and name
// of the section with authorization to the client
// you are calling (default section is 'default')
var eg = new EdgeGrid({
  path: '/path/to/.edgerc',
  section: 'section-name'
});

eg.auth({
  path: '/diagnostic-tools/v1/locations',
  method: 'GET',
  headers: {},
  body: data
});

eg.send(function(error, response, body) {
  console.log(body);
});
```

An `.edgerc` file contains sections for each of your API client credentials and is usually hosted in your home directory:

```plaintext
[default]
host = akaa-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.luna.akamaiapis.net/
client_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
client_secret = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
access_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
max-body = 131072

[section-name]
host = akaa-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.luna.akamaiapis.net/
client_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
client_secret = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
access_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
max-body = 131072
```

### Manual authentication

You can also authenticate manually by hard coding your credential values and passing them to the EdgeGrid client:

```javascript
var clientToken = "akab-client-token-xxx-xxxxxxxxxxxxxxxx",
    clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=",
    accessToken = "akab-access-token-xxx-xxxxxxxxxxxxxxxx",
    baseUri = "https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/";

var eg = new EdgeGrid(clientToken, clientSecret, accessToken, baseUri);
```

### Chaining

You can also chain calls using the `akamai-edgegrid` like in this example:

```javascript
...
eg.auth({
  path: '/papi/v1/groups',
  method: 'GET',
  headers: {},
}).send(function (error, response, body) {
  console.log(body);
});
```
### Headers

Headers for the request must be supplied in an object as name-value pairs. You do not need to supply form-data headers or content lengths - that will cause authentication headers on the API.

```javascript
eg.auth({
  path: '/papi/v1/groups',
  method: 'GET',
  headers: {
    'Accept': "application/json"
  }
});
```

### Body data

The request `body` can be provided as either an object or as a POST data formed string.


```javascript
// Object
eg.auth({
    path: '/papi/v1/cpcodes?contractId=ctr_1234&groupId=grp_1234',
    method: 'POST',
    body: {
        cpcodeName: "test-cpcode",
        productId: "prd_Site_Accel"
    }
});
```
  
### Query string parameters

Query string parameters must be supplied in an object as name-value pairs and 
passed to the `auth` method under the `qs` property.

```javascript
eg.auth({
    path: '/papi/v1/cpcodes',
    method: 'POST',
    headers: {},
    qs: {
        contractId: "ctr_1234",
        groupId: "grp_1234",
    },
    body: data
})

// Produces request URL similar to:
// https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/papi/v1/cpcodes?contractId=ctr_1234&groupId=grp_1234
```

### Debug

With EdgeGrid you can enable debugging either as part of the EdgeGrid instantiation object
or by setting the `EG_VERBOSE` environment variable. When enabled, EdgeGrid provides 
additional information about the request that's helpful for debugging.

Here's an EdgeGrid example:

```javascript
// Set debug via EdgeGrid property
var eg = new EdgeGrid({
  path: edgercPath,
  section: sectionName,
  debug: true
});
```

And here's an example for a command-line argument:

```bash
// Set debug via environment variable
$ export EG_VERBOSE=true
$ node src/main.js

Starting Request {
  url: 'https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/papi/v1/groups',
  method: 'get',
  data: '',
  headers: {
    common: { Accept: 'application/json, text/plain, */*' },
    delete: {},
...
Response: {
  status: 200,
  statusText: 'OK',
  headers: {
    server: 'nginx',
    'content-type': 'application/json;charset=UTF-8',
...
}
```

## Reporting issues

To report a problem or make a suggestion, create a new [GitHub issue](https://github.com/akamai/AkamaiOPEN-edgegrid-node/issues).

## License

Copyright 2021 Akamai Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
