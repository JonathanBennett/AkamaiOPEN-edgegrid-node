// 

var https = require('https'),
url = require('url');

/**
*	@constructor
*	
*	api_url
*	token
*
*/

var client_token = "akab-o3jlsjobps3kciyo-siwrojkbm2omvotk",
client_secret = "HID1GR08ohB9jbux4o16hC8Zg/DEtbqdB0jOa7Cb9ns=",
access_token = "akab-xtm54urikd2mu7n2-au3kl7lyi3iifgpp"; // (billing)

var auth = require('./src/auth.js');

var request = {
		    "url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/cpcodes/",
		    "method": "GET",
		    "headers": {
		    }
		};

request = auth.generate_auth(request, client_token, client_secret, access_token);

var parts = url.parse(request.url);
request.hostname = parts.hostname,
request.port = parts.port,
request.path = parts.path;

console.log(request);

var req = https.request(request, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);

  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
req.end();
// console.log(request);