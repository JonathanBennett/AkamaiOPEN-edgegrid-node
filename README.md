# EdgeGrid for Node.js

[![Build Status](https://travis-ci.org/akamai-open/AkamaiOPEN-edgegrid-node.svg?branch=master)](https://travis-ci.org/akamai-open/AkamaiOPEN-edgegrid-node)

This library implements an Authentication handler for the [Akamai OPEN](hhttps://developer.akamai.com/introduction/) EdgeGrid Authentication scheme in Node.js For more infomation visit the [Akamai {OPEN} Developer Portal](https://developer.akamai.com/).

## Installation

`npm install --save edgegrid`

## Example

#### Credentials

To use the Akamai OPEN APIs you must first register and authorize a set of credentials through the [LUNA Control Center](https://control.akamai.com/homeng/view/main). More information on creating and authorizing credentials can be found at [https://developer.akamai.com/introduction/Prov_Creds.html](https://developer.akamai.com/introduction/Prov_Creds.html)

#### .edgerc Authentication

The preferred method of using the library involves providing the path to an '.edgerc' file which contains the authenticaion credentials which will be used to sign your requests.

__NOTE__: Requests to the API are signed with a timestamp and therefore should be executed immediately.

```javascript
var EdgeGrid = require('edgegrid');

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

eg.send(function(data, response) {
  console.log(data);
});
```

An `.edgerc` file contains sections of credentials and is usually hosted in your home directory:

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

#### Manual Authentication

In addition supplying credentials via an .edgerc file as above, you may also authenticate manually by hard-coding your credential values and passing them to the EdgeGrid client:

```javascript
var clientToken = "akab-access-token-xxx-xxxxxxxxxxxxxxxx",
    clientSecret = "akab-client-token-xxx-xxxxxxxxxxxxxxxx",
    accessToken = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=",
    baseUri = "https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/";

var eg = new EdgeGrid(clientToken, clientSecret, accessToken, baseUri);
```

#### Chaining

Calls using the edgegrid client can also be chained as per the following;

```javascript
...
eg.auth({
  path: 'billing-usage/v1/products',
  method: 'POST',
  headers: {},
  body: data
}).send(function (data, response) {
  console.log(data);
});
```
#### Headers and Body Data

Headers for the request must be supplied in an object as name : value pairs. You do not need to supply form-data headers or content lengths - that will cause authentication headers on the API.

The request BODY can be provided as either an object or as a POST data formed string.

## Reporting a bug

To report a bug simply create a new GitHub Issue and describe your problem or suggestion.

Before reporting a bug look around to see if there are any open or closed tickets that cover your issue, and check the [Akamai OPEN Developer Community](https://community.akamai.com/community/developer) to see if there are any posts that might address your concern. And remember the wisdom: pull request > bug report > tweet!

## Contributors

A huge thanks to [Jonatahn Bennett](https://github.com/JonathanBennett) for creating and maintaining the original iteration of this project and to the following contributors:

* [@dariusk](https://github.com/dariusk)
* [@mdb](https://github.com/mdb)
* [@ktyacke](https://github.com/ktyacke)

__NOTE__: If you'd like to contribute please feel free to create a fork and submit a pull request.

## License

Copyright 2015 Akamai Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
