# EdgeGrid for Node.js

This library implements an Authentication handler for requests that provides the [Akamai {OPEN} Edgegrid Authentication scheme](https://developer.akamai.com/stuff/Getting_Started_with_OPEN_APIs/Client_Auth.html). For more infomation visit the [Akamai {OPEN} Developer Community](https://developer.akamai.com/).

@jldb

## Installation

`npm install --save edgegrid`

## Reporting a bug

To report a bug simply create a new GitHub Issue and describe your problem or suggestion. 

Before reporting a bug look around to see if there are any open or closed tickets that cover your issue. And remember the wisdom: pull request > bug report > tweet!

## Contributing

To contribute please feel free to create a fork and submit a pull request. 

## Example

To use the AkamaiOPEN API you must first register the correct user credentials. You can do that through the LUNA control panel.

Basic use of the library looks like the following. This will prepare the auth header and then execute it. Remember that requests to the API are signed with a timestamp and therefore should be executed immediately.

```javascript 

	var EdgeGrid = require('edgegrid');

	var client_token = "akab-access-token-xxx-xxxxxxxxxxxxxxxx",
	  client_secret = "akab-client-token-xxx-xxxxxxxxxxxxxxxx",
	  access_token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=",
	  base_uri = "https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/";

	var data = "datadatadatadatadatadatadatadata";

	var eg = new EdgeGrid(client_token, client_secret, access_token, base_uri);

	eg.auth({
	  "path": "billing-usage/v1/products",
	  "method": "POST",
	  "headers": {},
	  "body": data
	});

	eg.send(function (data, response) {
	  console.log(data);
	});

```

Calls using the edgegrid client can also be chained as per the following;

```javascript
	...

	eg.auth({
	  "path": "billing-usage/v1/products",
	  "method": "POST",
	  "headers": {},
	  "body": data
	}).send(function (data, response) {
	  console.log(data);
	});
```

Headers for the request must be supplied as an object as name : value pairs. You do not need to supply form-data headers or content lengths - that will cause authentication headers on the API.

The request BODY can be provided as either an object or as an already POST data formed string.


## Contributors

Thanks to people who have contributed to this.

* [@dariusk](https://github.com/dariusk)
