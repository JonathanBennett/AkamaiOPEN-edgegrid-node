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
        // Break string apart at first occurance of equal sign 
        // character in case the character is found in the value
        // strings.
        var index = config.indexOf('='),
            key = config.substr(0, index)
        val = config.substr(index + 1, config.length - index - 1);

        result[key.trim()] = val.trim();
    });

    return validatedConfig(result);
}

module.exports = function(path, conf) {
    var edgerc = fs.readFileSync(path).toString().split("\n"),
        confGroup = conf || 'default',
        confData = getGroup(edgerc, confGroup);

    if (!confData) {
        throw new Error('An error occurred parsing the .edgerc file. You probably specified an invalid group name.');
    }

    return buildObj(confData);
};
