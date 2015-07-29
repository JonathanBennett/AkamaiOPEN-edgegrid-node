var fs = require('fs');

function getGroup(lines, groupName) {
  var match = /\[(.*)\]/,
      lineMatch,
      group;

  lines.forEach(function(line, i) {
    lineMatch = line.match(match);

    if (lineMatch && lineMatch[1] === groupName) {
      group = lines.slice(i + 1, i + 5);
    }
  });

  return group;
}

function validatedConfig(config) {
  if (config.host.indexOf('https://') > -1) {
    return config;
  }

  config.host = 'https://' + config.host;

  return config;
}

function buildObj(configs) {
  var result = {},
      keyVal;

  configs.forEach(function(config) {
    keyVal = config.split('=');

    result[keyVal[0].trim()] = keyVal[1].trim();
  });

  return validatedConfig(result);
}

module.exports = function(path, conf) {
  var edgerc = fs.readFileSync(path).toString().split("\n"),
      confGroup = conf || 'default',
      confData = getGroup(edgerc, confGroup);

  if (!confData) {
    throw('An error occurred parsing the .edgerc file. You probably specified an invalid group name.');
  }

  return buildObj(confData);
};
