var assert = require('assert'),
    helpers = require('../../src/helpers');

describe('helpers', function() {
  describe('#isRedirect', function() {
    describe('when it is passed a status code indicating a redirect', function() {
      it('returns true when it is passed a 300', function() {
        assert.equal(helpers.isRedirect(300), true);
      });

      it('returns true when it is passed a 301', function() {
        assert.equal(helpers.isRedirect(301), true);
      });

      it('returns true when it is passed a 302', function() {
        assert.equal(helpers.isRedirect(302), true);
      });

      it('returns true when it is passed a 303', function() {
        assert.equal(helpers.isRedirect(303), true);
      });

      it('returns true when it is passed a 307', function() {
        assert.equal(helpers.isRedirect(307), true);
      });
    });

    describe('when it is passed a status code that does not indicate a redirect', function() {
      it('returns false when it is passed a 200', function() {
        assert.equal(helpers.isRedirect(200), false);
      });
    });
  });
});
