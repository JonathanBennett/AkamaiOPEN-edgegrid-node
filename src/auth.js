// Authorization: EG1-HMAC-SHA256
// client_token + access_token + timestamp

var uuid = require('node-uuid'),
moment = require('moment'),
crypto = require('crypto'), 
_ = require('underscore'), 
url = require('url');

var createTimestamp = function() { 
	var timestamp = moment().utc().format('YYYYMMDDTHH:mm:ss+0000');
	return timestamp;
} 

var base64_hmac_sha256 = function(data, key) {
	console.log("KEYYYYYY",data)
	var encrypt = crypto.createHmac("sha256", key);
	encrypt.update(data);
	return encrypt.digest("base64");
}

var canonicalize_headers = function(request) {
	var new_headers = "";
	_.each(request.headers, function(value, header) {
		if(value) { 
			header = header.toLowerCase();
			value = value.replace(/\s+/g, ' ');
			new_headers += header +":"+value+"\\t";
		}
	});

	return new_headers;
}

var make_content_hash = function(request, max_body) { 

        var content_hash = "",
        prepared_body = request.body || "";
        console.log("body is \"" + prepared_body + "\"");


        if(request.method == "POST" && prepared_body.length > 0) {
        	console.log("Signing content: \"" + prepared_body + "\"");
        	console.log(prepared_body.length);
        	if(prepared_body.length > max_body) { 
        		console.log("Data length ("+request.body.length+") is larger than maximum "+max_body);
        		prepared_body = prepared_body.substring(0,max_body);
        		console.log("Body truncated. New value \"" +prepared_body + "\"");
        	}

        	var shasum = crypto.createHash('sha256');
        	shasum.update(prepared_body);
        	content_hash = shasum.digest("base64");

        	console.log("Content hash is \""+content_hash+"\"");
        	return content_hash;
        }
}

var make_data_to_sign = function(request, auth_header) { 

 	var parsed_url = url.parse(request.url, true);
 	var data_to_sign = [
 	request.method.toUpperCase(),
 	parsed_url.protocol.replace(":",""),
 	parsed_url.host,
 	parsed_url.path,
 	canonicalize_headers(request),
 	make_content_hash(request),
 	auth_header
 	].join("\t").toString();

 	console.log('data to sign: "'+ data_to_sign +'" \n')

 	return data_to_sign;
}

var sign_request = function(request, timestamp, client_secret, auth_header) {
	return base64_hmac_sha256(make_data_to_sign(request, auth_header), make_signing_key(timestamp, client_secret));
}

var make_signing_key = function(timestamp, client_secret) { 

    var signing_key = base64_hmac_sha256(timestamp, client_secret);
    console.log("Signing key: "+signing_key+"\n");
    return signing_key;
}

var make_auth_header = function(request, client_token, access_token, client_secret, timestamp, nonce) { 

 	var key_value_pairs = {
 		"client_token":client_token,
 		"access_token":access_token,
 		"timestamp":timestamp,
 		"nonce":nonce
 	}

 	var joined_pairs = "";
 	_.each(key_value_pairs, function(value, key) { 
 		joined_pairs += key+"="+value+";";
 	});

 	var auth_header = "EG1-HMAC-SHA256 " + joined_pairs;

 	console.log("Unsigned authorization header: "+auth_header+"\n");

 	var signed_auth_header = auth_header + "signature=" + sign_request(request, timestamp, client_secret, auth_header);

 	console.log("Signed authorization header: " + signed_auth_header+"\n");

 	return signed_auth_header;


}

var that = this;

module.exports = {
	generate_auth: function(request, client_token, client_secret, access_token, max_body) {

		max_body = max_body || 2048;
		var guid = uuid.v4();
		var timestamp = createTimestamp();

		//console.log(base64_hmac_sha256(timestamp, client_secret));
		// console.log(canonicalize_headers({
		// 	"x-a":"va",
		// 	"x-c": '"      xc        "',
		// 	"x-b": "   w         b",
		// 	"x-d": ""
		// }));

		// console.log(make_content_hash({"body":"hello I am the body of this request.", "method":"POST"}, max_body));

// 		console.log(make_data_to_sign(request, "auth_header"));

		request.headers.Authorization = make_auth_header(request, client_token, access_token, client_secret, timestamp, guid);
		return request;
		//console.log(make_auth_header(request, client_token, access_token, timestamp, guid));
	}
}