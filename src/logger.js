var log4js = require('log4js'),
    logger = log4js.getLogger();

if (!process.env.LOG4JS_CONFIG) {
  logger.setLevel(log4js.levels.ERROR);
}

module.exports = logger;
