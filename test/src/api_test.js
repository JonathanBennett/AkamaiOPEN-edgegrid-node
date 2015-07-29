var assert = require('assert'),
    path = require('path'),
    Api = require('../../src/api');

describe('Api', function() {
  beforeEach(function() {
    this.api = new Api(
      'clientToken',
      'clientSecret',
      'accessToken',
      'base.com'
    );
  });

  describe('.config', function() {
    it('reports the client token', function() {
      assert.equal(this.api.config.client_token, 'clientToken');
    });

    it('reports the client secret', function() {
      assert.equal(this.api.config.client_secret, 'clientSecret');
    });

    it('reports the access token', function() {
      assert.equal(this.api.config.access_token, 'accessToken');
    });

    it('reports the API base URI', function() {
      assert.equal(this.api.config.base_uri, 'base.com');
    });
  });
});
