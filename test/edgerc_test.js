var assert = require('assert'),
    path = require('path'),
    edgerc = require('../src/edgerc');

describe('edgerc', function() {
  describe('the parsed edgrc file it returns', function() {
    describe('when it is not passed a second argument indicating config group', function() {
      beforeEach(function() {
        this.config = edgerc(path.resolve(__dirname, 'test_edgerc'));
      });

      it('reports the default host', function() {
        assert.equal(this.config.host, 'https://example.luna.akamaiapis.net');
      });

      it('reports the default client_token', function() {
        assert.equal(this.config.client_token, 'clientToken');
      });

      it('reports the default client_secret', function() {
        assert.equal(this.config.client_secret, 'clientSecret');
      });

      it('reports the default access_token', function() {
        assert.equal(this.config.access_token, 'accessToken');
      });
    });

    describe('when it is passed a second argument indicating config group', function() {
      beforeEach(function() {
        this.config = edgerc(path.resolve(__dirname, 'test_edgerc'), 'group');
      });

      it('reports the host associated with the group', function() {
        assert.equal(this.config.host, 'https://groupexample.luna.akamaiapis.net');
      });

      it('reports the client_token associated with the group', function() {
        assert.equal(this.config.client_token, 'groupClientToken');
      });

      it('reports the client_secret associated with the group', function() {
        assert.equal(this.config.client_secret, 'groupClientSecret');
      });

      it('reports the access_token associated with the group', function() {
        assert.equal(this.config.access_token, 'groupAccessToken');
      });
    });

    describe('when the group contains a host with the "https://" protocal specified', function() {
      beforeEach(function() {
        this.config = edgerc(path.resolve(__dirname, 'test_edgerc'), 'https');
      });

      it('reports a host with a valid URI string', function() {
        assert.equal(this.config.host, 'https://example.luna.akamaiapis.net');
      });
    });
  });
});
