var fs = require('fs');

module.exports = function(path, conf) {
  var edgerc = fs.readFileSync(path).toString().split("\n"),
      confGroup = conf || 'default',
      confData = [];

  for(var i=0;i<edgerc.length;i++) {
    var matchConf = edgerc[i].match(/\[(.*)\]/);
    // if we found our matching config, push the next 4 lines into a temp array
    if (matchConf && matchConf[1] === confGroup) {
      confData.push(edgerc[i+1]);
      confData.push(edgerc[i+2]);
      confData.push(edgerc[i+3]);
      confData.push(edgerc[i+4]);
      // convert the array to a descriptive object
      confData = confData.map(function(el) {
        var ret = {}
        var key = el.split(' = ')[0].trim();
        var val = el.split(' = ')[1].trim();
        if (key === 'host') {
          val = 'https://' + val;
        }
        ret[key] = val;
        return ret;
      });
      // turn the array of objects into a single object
      var result = {};
      for (var i = 0, length = confData.length; i < length; i++) {
        result[Object.keys(confData[i])[0]] = confData[i][Object.keys(confData[i])[0]];
      }
      return result;
    }
  }
  // if we escaped the parse loop without returning, something is wrong
  throw('An error occurred parsing the .edgerc file. You probably specified an invalid group name.');
};
