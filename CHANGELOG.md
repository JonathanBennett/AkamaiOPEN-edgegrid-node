# RELEASE NOTES

## 3.1.1 (Sep 28, 2021)

#### BUG FIXES:
* Update version of axios to 0.21.4 to get rid of ReDoS vulnerability

## 3.1.0 (Sep 27, 2021)

#### BUG FIXES:
* Fix support of environment variables ([#27](https://github.com/akamai/AkamaiOPEN-edgegrid-node/issues/27))
* Fix error when Tarball exceeds maxbody size ([#33](https://github.com/akamai/cli-edgeworkers/issues/33))

#### FEATURES/ENHANCEMENTS
* Replace 'request' package with axios ([#64](https://github.com/akamai/AkamaiOPEN-edgegrid-node/issues/64))
* Fix code quality issues
* Update version of mocha
* Add resolving ~ sign in edgerc path